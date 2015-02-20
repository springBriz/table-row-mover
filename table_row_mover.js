/**
 * table row mover - jQuery Plugin
 *
 * @author springBriz <apribriz@gmail.com>
 */

(function(factory) {
    'use strict';

    // CommonJS module
    if (typeof exports === 'object') {
        factory(require('jquery'));
    }
    // AMD module
    else if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    // Global
    else {
        factory(window.jQuery);
    }
}(function($) {
    // direction constant variable
    var DIR = {
        UP: 1,
        DOWN: -1
    };

    /**
     * @param {String} rowTagName 'tr' or 'tbody'
     * @param {Object} selectors
     * @param {Function} completeCallback
     * @returns jQuery Object
     */
    $.fn.tableRowMover = function() {
        var $table = $(this),
            rowTagName = (typeof arguments[0] === 'string' && arguments[0].toLowerCase() === 'tbody') ? 'tbody' : 'tr',
            selectors = $.extend({
                row: '.movable-table-row',
                moveTop: '.move-top',
                moveUp: '.move-up',
                moveDown: '.move-down',
                moveBottom: '.move-bottom'
            }, arguments[1] || {}),
            completeCallback = arguments[2];

        if ($table.css('position') === 'static') {
            $table.css('position', 'relative');
        }

        function moveRow(e) {
            var direction = e.data && e.data.direction || DIR.UP,
                toEnd = e.data && e.data.toEnd || false;

            var $btn = $(this),
                $row = $btn.parents(rowTagName + selectors.row),
                $rowPosition = $row.position(),
                $placeholder = $row.clone().removeClass();

            // check
            if (direction === DIR.UP) {
                // first or second row
                var prevRowsLen = $row.prevAll(selectors.row).length;
                if (prevRowsLen < 1) {
                    return false;
                }
                else if (prevRowsLen === 1) {
                    toEnd = true;
                }
            }
            else {
                // last row
                if ($row.nextAll(selectors.row).length < 1) {
                    return false;
                }
            }

            // remove tooltip, etc.
            $btn.trigger('mouseout');

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
            $row.after($placeholder);

            // move row to bottom
            $row.nextAll(selectors.row).last().after($row);

            // animate moving
            $row.animate({
                top: (direction === DIR.UP ?
                    (
                        '-=' + (toEnd === true ? (function() {
                            var h = 0;
                            $placeholder.prev(selectors.row).prevAll(selectors.row).each(function() {
                                h += $(this).height();
                            });
                            return h;
                        })() : $placeholder.prev(selectors.row).height())
                    ) : (
                        '+=' + (toEnd === true ? (function() {
                            var h = 0;
                            $placeholder.next(selectors.row).nextAll(selectors.row).each(function() {
                                h += $(this).height();
                            });
                            return h;
                        })() : $placeholder.next(selectors.row).height())
                    )
                )

            }, 'fast', 'swing', function() {
                $row.css({
                    position: '',
                    top: '',
                    left: ''
                });

                // move row
                if (direction === DIR.UP) {
                    if (toEnd === true) {
                        $placeholder.prevAll(selectors.row).last().before($row);
                    }
                    else {
                        $placeholder.prev(selectors.row).before($row);
                    }
                }
                else {
                    if (toEnd === true) {
                        $placeholder.nextAll(selectors.row).last().after($row);
                    }
                    else {
                        $placeholder.next(selectors.row).after($row);
                    }
                }

                // remove placeholder
                $placeholder.remove();

                // complete callback
                if (typeof completeCallback === 'function') {
                    completeCallback();
                }
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
}));