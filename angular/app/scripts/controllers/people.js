'use strict';

angular.module('psico2App')
  .controller('PeopleCtrl', function ($scope, $rootScope, $http, alert, authToken) {
    $scope.submit = function () {
      var url = 'http://localhost:1337/people';
      var people = {
        email: $scope.email,
        password: $scope.password,
        phone: $scope.phone,
        cep: $scope.cep,
        contactName: $scope.contactName,
        contactPhone: $scope.contactPhone
      };

      $http.post(url, people)
      .success(function (res) {
        alert('success','Ok!', 'Usuário registrado com sucesso');         
      })
      .error(function (err) {
        if(err.message === 'Autenticação falhou') {
          alert('warning', 'Erro!', 'Você precisa estar autenticado para cadastrar um participante');
        } else {
      	  alert('warning', 'Erro!', 'Não foi possível registrar o participante.');
        }    
      });	
    };
  });
