'use strict';

angular.module('psico2App')
  .controller('UserCtrl', function ($scope, $rootScope, $http, alert, authToken) {
    $scope.submit = function () {
      var url = 'http://localhost:1337/user';
      var user = {
        email: $scope.email,
        password: $scope.password,
        name: $scope.name,
        crp: $scope.crp,
        phone: $scope.phone,
        address: $scope.address
      };
      $http.post(url, user)
      .success(function (res) {
        alert('success','Ok!', 'Usuário registrado com sucesso');         
      })
      .error(function (err) {
        if(err.message === 'Autenticação falhou') {
          alert('warning', 'Erro!', 'Você precisa estar autenticado para cadastrar um usuário');
        } else {
      	  alert('warning', 'Erro!', 'Não foi possível registrar o usuário.');
        }    
      });	
    };
  });
