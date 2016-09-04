'use strict';

/**
 * @ngdoc function
 * @name psico2App.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the psico2App
 */
app.controller('LogoutCtrl', function (authToken, $state, $cookies) {
    authToken.removeToken();
    $cookies.remove('loggedUserMail');
    $cookies.remove('loggedUserName');
    $state.go('login');
  });
