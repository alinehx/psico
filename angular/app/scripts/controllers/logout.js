'use strict';

/**
 * @ngdoc function
 * @name psico2App.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the psico2App
 */
angular.module('psico2App')
  .controller('LogoutCtrl', function (authToken, $state) {
    authToken.removeToken();
    $state.go('main');
  });
