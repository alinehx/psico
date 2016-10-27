'use strict';
angular.module('psico2App')
  .factory('globalized', function($window) {
    //var actualHost = 'http://localhost:1337';
    var actualHost = 'http://54.70.125.75:1337';

    return actualHost;
  });