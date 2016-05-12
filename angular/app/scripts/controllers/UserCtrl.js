'use strict';

app.controller('UserCtrl', function ($scope, $rootScope, $http, alert, authToken, $state) {
  var vm = this;
  vm.state = $state;
  vm.url = 'http://localhost:1337/user';
  vm.isEdt = false;

  $scope.user = {
    email: null,
    password: "a123",
    name: null,
    crp: null,
    phone: null,
    zipCode: null,
  };
  $scope.comp = null;

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
});
app.$inject = ['$scope']; 