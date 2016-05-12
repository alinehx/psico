'use strict';

app.controller('TesteCtrl', function ($scope, $rootScope, $http, alert, authToken, $state) {
  var vm = this;
  vm.state = $state;
  vm.url = 'http://localhost:1337/member';
  vm.isEdt = false;

  $scope.member = {
    email: null,
    password: "a123",
    name: null,
    crp: null,
    phone: null,
    zipCode: null,
  };
  $scope.comp = null;

  $scope.submit = function () {
    $http.post(vm.url, $scope.member)
    .success(function (res) {
      alert('success','Ok!', 'Participante cadastrado com sucesso');
      $state.go('main');//@todo enviar para a tela de visualização do usuário 
    })
    .error(function (err) {
      if(err.message === 'Autenticação falhou') {
        alert('warning', 'Erro!', 'Você precisa estar autenticado para cadastrar um Participante');
      } else {
        alert('warning', 'Erro!', 'Não foi possível registrar o usuário.');
      }    
    }); 
  };

  //Section ListUser and UserByEmail
  vm.memberList = [];
  vm.memberDetail = {};

  $scope.getMemberList = function (){
    $http.get(vm.url)
      .success(function (res){
        vm.memberList = res;
      })
      .error(function(err){
        alert('warning',"Error! Cannot Get Users. Check your network connection.");
      });
  };

  $scope.getMemberByEmail = function (email){
    var newurl = vm.url + "/" + email;
    $http.get(newurl)
      .success(function (res){
        vm.memberDetail = res;
        vm.memberMail = vm.memberDetail.email;
        vm.memberDetail.createdAt = moment(vm.memberDetail.createdAt).format("DD/MM/YYYY - HH:MM");
        vm.memberDetail.updatedAt = moment(vm.memberDetail.updatedAt).format("DD/MM/YYYY - HH:MM");
      })
      .error(function(err){
        alert('warning',"Error! Cannot Get Users. Check your network connection.");
      });
  };
  
  $scope.openMemberDetail = function(email){
    $state.go('membr', { email:email });
  };

  //Section ManipulateUserDetails
  vm.memberMail = null;

  vm.editMember = function(){
    vm.isEdt = true;
  };

  vm.updateMember = function(){
    vm.newMember = {
      email: vm.memberDetail.email,
      phone: vm.memberDetail.phone,
      zipCode: vm.memberDetail.zipCode,
      name: vm.memberDetail.name,
      crp: vm.memberDetail.crp
    };
    var newurl = vm.url + "/" + vm.memberMail;
    $http.put(newurl, vm.newMember)
      .success(function (res){
        alert('success',"Dados alterados com sucesso!");
        $state.go('listofmembers');
      })
      .error(function(err){
        alert('warning', "Error! Cannot Update User. Check your network connection.");
      });
  };

  //Section DisableUser and EnableUser
  vm.killConfirm = false;
  vm.disableMember = function(){
    var newurl = vm.url + "/" + vm.memberMail;
    $http.delete(newurl, vm.memberDetail)
      .success(function (res){
        alert('success',"O Participante "+ vm.memberDetail.name + " foi desativado com sucesso!");
        $state.go('listofmembers');
      })
      .error(function(err){
        alert('warning', "Error! Cannot Update Member. Check your network connection.");
      });
  };

  vm.enableMember = function(){
    var newurl = vm.url + "/" + vm.memberMail;
    vm.newMember = {
      active: true
    };
    $http.put(newurl, vm.newMember)
      .success(function (res){
        alert('success',"O Participante "+ vm.memberDetail.name + " foi re-ativado com sucesso!");
        $state.go('listofmembers');
      })
      .error(function(err){
        alert('warning', "Error! Cannot Update Member. Check your network connection.");
      });
  };

  $scope.backToMain = function(){
    $state.go('main');
  };
});
app.$inject = ['$scope']; 