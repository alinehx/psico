'use strict';

app.controller('LoginCtrl', function ($scope, $rootScope, $http, alert, authToken, $state) {
    authToken.removeToken();//Quando voltar para /Login por engano ou proposito, mata a auth.

    var vm = this;
    vm.url = 'http://localhost:1337/login';

    $scope.user = {
      email: null,
      password: null
    };

    $scope.submit = function() {
      var newurl = vm.url+"/"+$scope.user.email+"&"+$scope.user.password;
      $http.get(newurl, $scope.user)
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
    };
  });
