'use strict';

app.controller('UserCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, globalized) {
  var actualHost = globalized;
  var vm = this;
  vm.state = $state;
  vm.url = actualHost + '/user';
  vm.isEdt = false;

  	//DefaultSettings
	$(document).ready(function(){
		$('#mainHeader').show();
		$('mainFooter').show();
		$("body").removeClass('not-occupied');
		$("body").removeClass('occupied');
	});

  $scope.comp = null;
  $scope.user = {
    email: null,
    password: "teste",
    name: null,
    crp: null,
    phone: null,
    zipCode: null,
  };

  $scope.submit = function () {
    $http.post(vm.url, $scope.user)
    .success(function (res) {
      alert('success','Ok!', 'Usuário cadastrado com sucesso');
      $scope.openUserDetail($scope.user.email);
    })
    .error(function (err) {
      if(err.message === 'Autenticação falhou') {
        alert('warning', 'Erro!', 'Você precisa estar autenticado para cadastrar um usuário');
      } else {
        alert('warning', 'Erro!', 'Não foi possível registrar o usuário.');
      }    
    }); 
  };

  //Section ListUser and UserByEmail
  vm.userList = [];
  vm.userDetail = {};

  $scope.getUserList = function (){
    $http.get(vm.url)
      .success(function (res){
        vm.userList = res;
      })
      .error(function(err){
        alert('warning',"Error! Cannot Get Users. Check your network connection.");
      });
  };

  $scope.getUserByEmail = function (email){
    var newurl = vm.url + "/" + email;
    $http.get(newurl)
      .success(function (res){
        vm.userDetail = res;
        vm.userMail = vm.userDetail.email;
        vm.userDetail.createdAt = moment(vm.userDetail.createdAt).format("DD/MM/YYYY - HH:MM");
        vm.userDetail.updatedAt = moment(vm.userDetail.updatedAt).format("DD/MM/YYYY - HH:MM");
      })
      .error(function(err){
        alert('warning',"Error! Cannot Get Users. Check your network connection.");
      });
  };
  
  $scope.openUserDetail = function(email){
    $state.go('usr', { email:email });
  };

  //Section ManipulateUserDetails
  vm.userMail = null;

  vm.editUser = function(){
    vm.isEdt = true;
  };

  vm.updateUser = function(){
    vm.newUser = {
      email: vm.userDetail.email,
      phone: vm.userDetail.phone,
      zipCode: vm.userDetail.zipCode,
      name: vm.userDetail.name,
      crp: vm.userDetail.crp
    };
    var newurl = vm.url + "/" + vm.userMail;
    $http.put(newurl, vm.newUser)
      .success(function (res){
        alert('success',"Dados alterados com sucesso!");
        $state.go('listofusers');
      })
      .error(function(err){
        alert('warning', "Error! Cannot Update User. Check your network connection.");
      });
  };

  //Section DisableUser and EnableUser
  vm.killConfirm = false;
  vm.disableUser = function(){
    var newurl = vm.url + "/" + vm.userMail;
    $http.delete(newurl, vm.userDetail)
      .success(function (res){
        alert('success',"O Usuário "+ vm.userDetail.name + " foi desativado com sucesso!");
        $state.go('listofusers');
      })
      .error(function(err){
        alert('warning', "Error! Cannot Update User. Check your network connection.");
      });
  };

  vm.enableUser = function(){
    var newurl = vm.url + "/" + vm.userMail;
    vm.newUser = {
      active: true
    };
    $http.put(newurl, vm.newUser)
      .success(function (res){
        alert('success',"O Usuário "+ vm.userDetail.name + " foi re-ativado com sucesso!");
        $state.go('listofusers');
      })
      .error(function(err){
        alert('warning', "Error! Cannot Update User. Check your network connection.");
      });
  };

  $scope.backToMain = function(){
    $state.go('main');
  };

  //Field Validation
  vm.validateAlpabeticField = function(info){

    if(info == 'null' || info == undefined)
      return false;

    var re = /^[A-Za-zà-úÀ-Ú0-9 \s]*$/;
    return re.test(info);
  };

  vm.validateIsFilled = function(info){

    if(info == 'null' || info == undefined)
      return false;

    return true;
  };

  vm.validateTelField = function(info){
    if(info == 'null' || info == undefined)
      return false;

    if(info.length < 10)
      return false;

    var re = /^[0-9 \s]*$/
    return re.test(info);
  };

  vm.validateLettersField = function(info){
    if(info == 'null' || info == undefined)
      return false;

    var re = /^[A-Za-zà-úÀ-Ú \s]*$/;
    return re.test(info);
  };

  vm.validateNumericField = function(info){
    if(info == 'null' || info == undefined)
      return false;

    if(info < 0)
      return false;

    var re = /^[0-9 \s]*$/
    return re.test(info);
  };

  vm.validateMailField = function(info){
    if(info == 'null' || info == undefined)
      return false;

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(info);
  };
  
});
app.$inject = ['$scope']; 