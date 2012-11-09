/*global module*/
module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({

    pkg: '<json:package.json>',

    meta: {
      banner: '\n/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n ' + '<%= pkg.homepage ? "* " + pkg.homepage + "\n *\n " : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n' +
        ' * Licensed under the <%= _.pluck(pkg.licenses, "type").join(", ") %> license */'
    },

    lint: {
      all: ['./grunt.js', './src/**/*.js', './test-src/test.js']
    },

    browserify: {
      "dist/tinyapp.js": {
        requires: ['traverse'],
        entries: ['src/**/*.js'],
        prepend: ['<banner:meta.banner>'],
        append: [],
        hook: function () {
          // bundle is passed in as first param
        }
      },
      "test/test.js": {
        requires: ['traverse'],
        entries: ['test-src/**/*.js'],
        prepend: ['<banner:meta.banner>'],
        append: [],
        hook: function () {
          // bundle is passed in as first param
        }
      }
    },

    jshint: {
      browser: false,
      node: true,
      strict: false,
      curly: true,
      eqeqeq: true,
      immed: true,
      latedef: true,
      newcap: true,
      nonew: true,
      noarg: true,
      sub: true,
      undef: true,
      unused: true,
      eqnull: true,
      boss: false
    },

    qunit: {
      browser: ['test/index.html']
    }
  });
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', 'lint browserify qunit');
  grunt.registerTask('install', 'browserify');
  grunt.registerTask('test', 'qunit');
};