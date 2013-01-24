/*global module*/
/*jshint camelcase:false*/ // because of gruntConfig.qunit_junit
module.exports = function (grunt) {
    'use strict';

    var gruntConfig = {
        pkg: grunt.file.readJSON('package.json')
    };


    // convenience
    grunt.registerTask('all', ['lint', 'test']);
    grunt.registerTask('default', ['all']);


    // continuous integration
    grunt.registerTask('ci', ['all']);


    // lint
    grunt.loadNpmTasks('grunt-contrib-jshint');
    gruntConfig.jshint = {};
    gruntConfig.jshint.options = { bitwise: true, camelcase: true, curly: true, eqeqeq: true, forin: true, immed: true,
        indent: 4, latedef: true, newcap: true, noarg: true, noempty: true, nonew: true, plusplus: true,
        quotmark: true, regexp: true, undef: true, unused: true, strict: true, trailing: true,
        maxparams: 3, maxdepth: 2, maxstatements: 50, maxcomplexity: 3
    };
    gruntConfig.jshint.all = [
        'Gruntfile.js',
        'src/**/*.js',
        '!src/lib/**/*.js',
        '!src/test/lib/**/*.js'
    ];
    grunt.registerTask('lint', 'jshint');


    // test
    grunt.loadNpmTasks('grunt-contrib-qunit');
    gruntConfig.qunit = {
        src: ['src/test/index.html']
    };
    grunt.loadNpmTasks('grunt-qunit-junit');
    gruntConfig.qunit_junit = {
        options: {
            dest: 'output/testresults'
        }
    };
    grunt.registerTask('test', ['qunit_junit', 'qunit:src']);


    // grunt
    grunt.initConfig(gruntConfig);

};