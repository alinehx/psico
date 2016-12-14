'use strict';

app.controller('LoginCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, $cookies, globalized) {
  authToken.removeToken();//Quando voltar para /Login por engano ou proposito, mata a auth.
  var actualHost = globalized;
  var vm = this;
  vm.url = actualHost + '/login';
  vm.urlUser = actualHost + '/user';
  vm.urlAgenda = actualHost + '/agenda';

  	//DefaultSettings
	$(document).ready(function(){
		$('#mainHeader').show();
		$('mainFooter').show();
		$("body").removeClass('not-occupied');
		$("body").removeClass('occupied');
	});

  vm.agendaList = {};
  $scope.user = {
    email: null,
    password: null
  };
  
  vm.setApp = function (){
    authToken.removeToken();
    var userMail = $cookies.get('loggedUserMail');
    if(userMail == undefined || userMail.length > 1){
      $cookies.remove('loggedUserMail');
      $cookies.remove('loggedUserName');
      $cookies.remove('isMaster');
      $state.go('login');
    }
  };

  $scope.submit = function() {
    var newurl = vm.url+"/"+$scope.user.email+"&"+$scope.user.password;
    $http.get(newurl, $scope.user)
    .success(function (res) {
      authToken.setToken(res.token);
      alert('success','Login Efetuado.', 'Seja Bem-vindo, ' + $scope.user.email); 
      setGlobalVars($scope.user.email);
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
