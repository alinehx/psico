'use strict';


angular.module('psico2App')
  .controller('HeaderCtrl', function ($scope, authToken) {
    $scope.isAuthenticated = authToken.isAuthenticated;
  });
