/**
 * table row mover - jQuery Plugin
 */
define([
    "jquery"
], function ($) {
    "use strict";

    // direction constant variable
    var DIR = {
        UP: 1,
        DOWN: -1
    };

    /**
     * @param {String} rowTagName 'tr' or 'tbody'
     * @param {String} rowClassSelector default '.movable-table-row'
     * @param {Object} selectors
     * @returns jQuery Object
     */
    $.fn.tableRowMover = function() {
        var $table = $(this),
            rowTagName = (typeof arguments[0] === 'string' && arguments[0].toLowerCase() === 'tbody') ? 'tbody' : 'tr',
            rowClassSelector = arguments[1] || '.movable-table-row',
            selectors = $.extend({
                moveTop: '.move-top',
                moveUp: '.move-up',
                moveDown: '.move-down',
                moveBottom: '.move-bottom'
            }, arguments[2] || {});

        if ($table.css('position') === 'static') {
            $table.css('position', 'relative');
        }

        function moveRow(e) {
            var direction = e.data && e.data.direction || DIR.UP,
                toEnd = e.data && e.data.toEnd || false;

            var $btn = $(this),
                $row = $btn.parents(rowTagName + rowClassSelector),
                $rowPosition = $row.position(),
                $placeholder = $row.clone().removeClass();

            var $theadThs,
                theadThBorderBottomWidth;

            // check
            if (direction === DIR.UP) {
                // first or second row
                var prevRowsLen = $row.prevAll(rowClassSelector).length;
                if (prevRowsLen < 1) {
                    return false;
                }
                else if (prevRowsLen === 1) {
                    toEnd = true;
                }
            }
            else {
                // last row
                if ($row.nextAll(rowClassSelector).length < 1) {
                    return false;
                }
            }

            // remove tooltip, etc.
            $btn.trigger('mouseout');

            // for fixing 1px height bug
            if (direction === DIR.UP && toEnd === true) {
                $theadThs = $table.find('thead th');
                theadThBorderBottomWidth = parseInt($theadThs.css('border-bottom-width'), 10);
            }

            // set placeholder height
            if (rowTagName === 'tr') {
                $placeholder.height($row.height()).find('td').html('').removeClass();
            }
            else {
                $placeholder.children('tr').each(function(i, tr) {
                    $(tr).height($row.children('tr').eq(i).height()).find('td').html('').removeClass();
                });
            }

            // ready to move
            $row.find('td').each(function() {
                $(this).width($(this).width());
            });
            $row.css({
                position: 'absolute',
                top: $rowPosition.top,
                left: $rowPosition.left
            });

            // insert placeholder
            if (direction === DIR.UP) {
                $row.after($placeholder);
            }
            else {
                $row.before($placeholder);
            }

            // move DOM
            if (direction === DIR.UP) {
                if (toEnd === true) {
                    $row.prevAll(rowClassSelector).last().before($row);
                    $theadThs.css({ borderBottomWidth: (theadThBorderBottomWidth - 1) + 'px' })
                }
                else {
                    $row.prev(rowClassSelector).before($row);
                }
            }
            else {
                if (toEnd === true) {
                    $row.nextAll(rowClassSelector).last().after($row);
                }
                else {
                    $row.next(rowClassSelector).after($row);
                }
            }

            // animate moving
            $row.animate({
                top: (direction === DIR.UP ?
                    (
                        '-=' + (toEnd === true ? (function() {
                            var h = 0;
                            $placeholder.prev(rowClassSelector).prevAll(rowClassSelector).each(function() {
                                h += $(this).height();
                            });
                            return h;
                        })() : $placeholder.prev(rowClassSelector).height())
                    ) : (
                        '+=' + (toEnd === true ? (function() {
                            var h = 0;
                            $placeholder.next(rowClassSelector).nextAll(rowClassSelector).each(function() {
                                h += $(this).height();
                            });
                            return h;
                        })() : $placeholder.next(rowClassSelector).height())
                    )
                )

            }, 'fast', 'swing', function() {
                $row.css({
                    position: '',
                    top: '',
                    left: ''
                });

                if (direction === DIR.UP && toEnd === true) {
                    $theadThs.css({ borderBottomWidth: theadThBorderBottomWidth + 'px' });
                }

                // remove placeholder
                $placeholder.remove();
            });
        }

        // bind event handlers
        $table
            .on('click', selectors.moveTop, { direction: DIR.UP, toEnd: true }, moveRow)
            .on('click', selectors.moveUp, { direction: DIR.UP }, moveRow)
            .on('click', selectors.moveDown, { direction: DIR.DOWN }, moveRow)
            .on('click', selectors.moveBottom, { direction: DIR.DOWN, toEnd: true }, moveRow);

        return $table;
    };
});