'use strict';
angular.module('psico2App')
  .factory('globalized', function($window) {
    var actualHost = 'http://localhost:1337';
    //var actualHost = 'http://35.163.118.191:1337';
    //var actualHost = 'http://52.67.196.196:1337';

    return actualHost;
  });