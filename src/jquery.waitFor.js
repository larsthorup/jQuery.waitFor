/*global jQuery,window*/
/*jslint vars:true nomen:true*/
(function ($) {
    'use strict';

    $.fn.waitFor = function (options) {
        options = options || {}; // Note: all arguments default
        options.timeout = options.timeout || 100; // Note: default timeout
        var dfd = $.Deferred();
        var selector = this.selector;
        function waitForDeferred(dfd, timeout) {
            var $elements = $(selector);
            if ($elements.length > 0) {
                dfd.resolve($elements);
            } else {
                var waitTime = 50;
                if (timeout < waitTime) {
                    dfd.reject('Timed out waiting for: "' + selector + '"');
                } else {
                    window.setTimeout(function () {
                        waitForDeferred(dfd, timeout - waitTime);
                    }, waitTime);
                }
            }
        }
        function startWaiting() {
            waitForDeferred(dfd, options.timeout);
        }
        if (options.pause) {
            window.setTimeout(startWaiting, options.pause);
        } else {
            startWaiting();
        }
        return dfd.promise();
    };
}(jQuery));
