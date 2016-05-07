'use strict';

angular.module('psico2App')
  .controller('LoginCtrl', function ($scope, $rootScope, $http, alert, authToken, $state) {
    $scope.submit = function () {
      var url = 'http://localhost:1337/login';
      var user = {
        email: $scope.email,
        password: $scope.password  
      };
      $http.post(url, user)
      .success(function (res) {
        alert('success','Ok!', 'Usuário conectado'); 
        authToken.setToken(res.token);
        $state.go('main');
      })
      .error(function (err) {
        if(err.message === 'Usuário ou senha inválidos') {
          alert('warning', 'Erro!', 'Usuário ou senha inválidos');
        } else {
      	  alert('warning', 'Erro!', 'Não foi possivel realizar o login');
        }    
      });	
    }
  });
