'use strict';

app.controller('LoginCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, $cookies) {
  authToken.removeToken();//Quando voltar para /Login por engano ou proposito, mata a auth.

  var vm = this;
  vm.url = 'http://localhost:1337/login';
  vm.urlUser = 'http://localhost:1337/user';
  vm.urlAgenda = 'http://localhost:1337/agenda';

  vm.agendaList = {};
  $scope.user = {
    email: null,
    password: null
  };

  vm.getAgendaForUser = function (email){
    var newurl = vm.urlAgenda + "/" + email;
    $http.get(newurl)
      .success(function (res){
        $cookies.putObject('userAgendas', res);
        $state.go('main');
      })
      .error(function(err){
        alert('warning',"Error! Não foi possivel executar a requisição. " + err);
      });
  };

  $scope.submit = function() {
    var newurl = vm.url+"/"+$scope.user.email+"&"+$scope.user.password;
    $http.get(newurl, $scope.user)
    .success(function (res) {
      authToken.setToken(res.token);
      alert('success','Login Efetuado.', 'Seja Bem-vindo, ' + $scope.user.email); 
      vm.getAgendaForUser($scope.user.email);
      setGlobalVars($scope.user.email);
    })
    .error(function (err) {
      if(err.message === 'Usuário ou senha inválidos') {
        alert('warning', 'Erro!', 'Usuário ou senha inválidos');
      } else {
        alert('warning', 'Erro!', 'Não foi possivel realizar o login');
      }    
    });	
  };

  //Set the user information on session.
  var setGlobalVars = function(email){
    var newurl = vm.urlUser + "/" + email;
    $http.get(newurl)
      .success(function (res){
        $cookies.put('loggedUserMail', res.email);
        $cookies.put('loggedUserName', res.name);
        $cookies.put('isMaster', res.isMaster);
      })
      .error(function(err){
        alert('warning',"Error! Cannot Get Users. Check your network connection.");
      });
  }

});
