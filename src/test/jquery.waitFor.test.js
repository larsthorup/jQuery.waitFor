/*global jQuery,QUnit,window*/
/*jslint vars:true nomen:true*/
(function ($) {
    'use strict';

    QUnit.module('jquery.waitFor');

    QUnit.asyncTest('found while waiting', function () {
        // when
        var dfd = $('#target').waitFor();
        window.setTimeout(function () {
            $('#qunit-fixture').html('<div id="target">apples</div>');
        }, 10);

        // then
        dfd.done(function ($elem) {
            QUnit.equal($elem.text(), 'apples', '$elem.text()');
            QUnit.start();
        });
        dfd.fail(function () { QUnit.ok(false, 'unexpected fail'); });
    });

    QUnit.asyncTest('found immediately', function () {
        // when
        $('#qunit-fixture').html('<div id="target">oranges</div>');
        var dfd = $('#target').waitFor();

        // then
        dfd.done(function ($elem) {
            QUnit.equal($elem.text(), 'oranges', '$elem.text()');
            QUnit.start();
        });
        dfd.fail(function () { QUnit.ok(false, 'unexpected fail'); });
    });

    QUnit.asyncTest('timeout before found', function () {
        // when
        var dfd = $('#target').waitFor();
        window.setTimeout(function () {
            $('#qunit-fixture').html('<div id="target">bananas</div>');
        }, 200);

        // then
        dfd.done(function () { QUnit.ok(false, 'unexpected done'); });
        dfd.fail(function () {
            QUnit.ok(true, 'fail');

            // Note: prevent disturbing the next test by waiting until the bananas #target have been inserted
            window.setTimeout(function () {
                QUnit.start();
            }, 200);
        });
    });

    QUnit.asyncTest('custom timeout', function () {
        // when
        var dfd = $('#target').waitFor({timeout: 300});
        window.setTimeout(function () {
            $('#qunit-fixture').html('<div id="target">grapes</div>');
        }, 200);

        // then
        dfd.done(function ($elem) {
            QUnit.equal($elem.text(), 'grapes', '$elem.text()');
            QUnit.start();
        });
        dfd.fail(function () { QUnit.ok(false, 'unexpected fail'); });
    });

    QUnit.asyncTest('custom pause', function () {
        // when
        var dfd = $('#target').waitFor({timeout: 50, pause: 250});
        window.setTimeout(function () {
            $('#qunit-fixture').html('<div id="target">grapes</div>');
        }, 200);

        // then
        dfd.done(function ($elem) {
            QUnit.equal($elem.text(), 'grapes', '$elem.text()');
            QUnit.start();
        });
        dfd.fail(function () { QUnit.ok(false, 'unexpected fail'); });
    });

    QUnit.asyncTest('pipeline', function () {
        // given
        window.setTimeout(function () {
            $('#qunit-fixture').html('<div id="target1">apples</div>');
        }, 30);

        // when
        $('#target1').waitFor().then(function ($target1) {
            // then
            QUnit.equal($target1.text(), 'apples', '$target1.text()');

            // and given
            window.setTimeout(function () {
                $('#qunit-fixture').html('<div id="target2">oranges</div>');
            }, 30);

            // and when
            return $('#target2').waitFor();
        }).then(function ($target2) {
            // and then
            QUnit.equal($target2.text(), 'oranges', '$target2.text()');
        }).done(function () {
            QUnit.start();
        }).fail(function (msg) {
            QUnit.ok(false, msg);
            QUnit.start();
        });
    });

    QUnit.asyncTest('pipeline-fails-late', function () {
        // given
        window.setTimeout(function () {
            $('#qunit-fixture').html('<div id="target1">apples</div>');
        }, 30);

        // when
        $('#target1').waitFor().then(function ($target1) {
            // then
            QUnit.equal($target1.text(), 'apples', '$target1.text()');

            // and given
            window.setTimeout(function () {
                $('#qunit-fixture').html('<div id="target2">oranges</div>');
            }, 30);

            // and when
            return $('#target2-not-found').waitFor();
        }).then(function () {
            QUnit.ok(false, '#target2-not-found found');
        }).done(function () {
            QUnit.ok(false, 'should never be called');
            QUnit.start();
        }).fail(function (msg) {

            // and then
            QUnit.equal(msg, 'Timed out waiting for: "#target2-not-found"', 'msg');
            QUnit.start();
        });
    });

    QUnit.asyncTest('pipeline-fails-early', function () {
        // given
        window.setTimeout(function () {
            $('#qunit-fixture').html('<div id="target1">apples</div>');
        }, 30);

        // when
        $('#target1-not-found').waitFor().then(function () {
            QUnit.ok(false, '#target1-not-found found');
        }).then(function () {
            QUnit.ok(false, 'should never be called');
        }).done(function () {
            QUnit.ok(false, 'should never be called');
            QUnit.start();
        }).fail(function (msg) {

            // and then
            QUnit.equal(msg, 'Timed out waiting for: "#target1-not-found"', 'msg');
            QUnit.start();
        });
    });

}(jQuery));