/**
 * table row mover - jQuery Plugin
 *
 * @author springBriz <apribriz@gmail.com>
 */

(function(factory) {
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
    'use strict';

    // direction constant variable
    var DIR = {
        UP: 1,
        DOWN: -1
    };

    /**
     * @param {Object}
     * @param {Function}
     * @returns jQuery Object
     */
    $.fn.tableRowMover = function() {
        var settings = $.extend({
            rowTagName: 'tr',
            selectors: {},
            animate: true,
            animateDuration: 'fast',
            animateEasing: 'swing'
        }, arguments[0] || {});

        var selectors = $.extend({
            row: '.movable-table-row', // must be a class selector
            moveTop: '.move-top',
            moveUp: '.move-up',
            moveDown: '.move-down',
            moveBottom: '.move-bottom'
        }, settings.selectors);

        var $table = $(this),
            completeCallback = arguments[1];

        if ($table.css('position') === 'static') {
            $table.css('position', 'relative');
        }

        function moveRow(e) {
            e.preventDefault();

            var $btn = $(this),
                $row = $btn.parents(settings.rowTagName + selectors.row),
                direction = e.data && e.data.direction || DIR.UP,
                toEnd = e.data && e.data.toEnd || false;

            // first or last row
            if ((direction === DIR.UP && $row.prevAll(selectors.row).length < 1)
                || (direction === DIR.DOWN && $row.nextAll(selectors.row).length < 1)) {
                return false;
            }

            // remove tooltip, etc.
            $btn.trigger('mouseout');

            // turn off animation
            if (settings.animate === false) {
                if (direction === DIR.UP) {
                    if (toEnd === true) {
                        $row.prevAll(selectors.row).last().before($row);
                    }
                    else {
                        $row.prev(selectors.row).before($row);
                    }
                }
                else {
                    if (toEnd === true) {
                        $row.nextAll(selectors.row).last().after($row);
                    }
                    else {
                        $row.next(selectors.row).after($row);
                    }
                }

                // complete callback
                if (typeof completeCallback === 'function') {
                    completeCallback.call($table, $row);
                }

                // done
                return;
            }

            // create placeholder
            var $placeholder = $row.clone().removeClass().addClass(selectors.row.replace(/^\./, ''));

            // set placeholder height
            if (settings.rowTagName === 'tr') {
                $placeholder.height($row.height()).find('td').html('').removeClass();
            }
            else {
                $placeholder.children('tr').each(function(i, tr) {
                    $(tr).height($row.children('tr').eq(i).height()).find('td').html('').removeClass();
                });
            }

            // set row width
            $row.find('td').each(function() {
                $(this).width($(this).width());
            });

            // set row position
            var $rowPosition = $row.position();
            $row.css({
                position: 'absolute',
                top: $rowPosition.top,
                left: $rowPosition.left
            });

            // insert placeholder
            $row.after($placeholder);

            // move row to the bottom
            $row.nextAll(selectors.row).last().after($row);

            // animate moving
            $row.animate({
                top: direction === DIR.UP ? (
                    '-=' + (toEnd === true ? (function() {
                        var h = 0;
                        $placeholder.prevAll(selectors.row).each(function() {
                            h += $(this).height();
                        });
                        return h;
                    })() : $placeholder.prev(selectors.row).height())
                ) : (
                    '+=' + (toEnd === true ? (function() {
                        var h = 0;
                        $placeholder.nextAll(selectors.row).each(function() {
                            if ($(this)[0] === $row[0]) {
                                return;
                            }
                            h += $(this).height();
                        });
                        return h;
                    })() : $placeholder.next(selectors.row).height())
                )
            }, settings.animateDuration, settings.animateEasing, function() {
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
                    completeCallback.call($table, $row);
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