'use strict';

angular.module('psico2App')
  .controller('RoomCtrl', function ($scope, $rootScope, $http, alert, authToken) {
    $scope.submit = function () {
      var url = 'http://localhost:1337/room';
      var room = {
        name: $scope.name,
        local: $scope.local,
        type: $scope.type,
        desc: $scope.desc,
        max: $scope.max
        };

      $http.post(url, room)
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
