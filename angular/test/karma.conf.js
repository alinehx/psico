// Karma configuration
// Generated on 2016-04-13

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/Flot/jquery.flot.js',
      'bower_components/angular-chosen/angular-chosen.js',
      'bower_components/angular-loading-bar/build/loading-bar.js',
      'bower_components/angular-translate/angular-translate.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/jquery-knob/js/jquery.knob.js',
      'bower_components/angular-knob/src/angular-knob.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-translate-loader-url/angular-translate-loader-url.js',
      'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
      'bower_components/angular-translate-storage-local/angular-translate-storage-local.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-ui-utils/ui-utils.js',
      'bower_components/angularjs-toaster/toaster.js',
      'bower_components/flatdoc/flatdoc.js',
      'bower_components/oclazyload/dist/ocLazyLoad.js',
      'bower_components/screenfull/dist/screenfull.js',
      'bower_components/slimScroll/jquery.slimscroll.min.js',
      'bower_components/moment/moment.js',
      'bower_components/flot-spline/js/jquery.flot.spline.js',
      'bower_components/flot.tooltip/js/jquery.flot.tooltip.js',
      'bower_components/ngstorage/ngStorage.js',
      'bower_components/jquery-ui/jquery-ui.js',
      'bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/jquery-bridget/jquery-bridget.js',
      'bower_components/seiyria-bootstrap-slider/js/bootstrap-slider.js',
      'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.js',
      'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.extensions.js',
      'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.date.extensions.js',
      'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.numeric.extensions.js',
      'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.phone.extensions.js',
      'bower_components/jquery.inputmask/dist/inputmask/jquery.inputmask.regex.extensions.js',
      'bower_components/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
      'bower_components/ng-table-export/ng-table-export.js',
      'bower_components/AngularGM/angular-gm.js',
      'bower_components/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
      'bower_components/ng-table/ng-table.js',
      'bower_components/fullcalendar/dist/fullcalendar.js',
      'bower_components/angular-ui-calendar/src/calendar.js',
      'bower_components/angular-file-upload/dist/angular-file-upload.min.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
