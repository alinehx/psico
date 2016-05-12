'use strict';

app.controller('PeopleCtrl', function ($scope, $rootScope, $http, alert, authToken, $state) {
  var vm = this;
  vm.state = $state;
  vm.url = 'http://localhost:1337/member';

  $scope.member = {
    email : null,
    name : null,
    gender : null,
    phone : null,
    zipCode : null,
    numberAddress : null
  };

  $scope.backToMain = function(){
    $state.go('main');
  };

  $scope.submit = function () {
    $http.post(vm.url, $scope.member)
    .success(function (res) {
      alert('success','Ok!', 'Participante registrado com sucesso');
      $scope.openMemberDetail($scope.member.email);
    })
    .error(function (err) {
      if(err.message === 'Autenticação falhou') {
        alert('warning', 'Erro!', 'Você precisa estar autenticado para cadastrar um participante');
      } else {
        alert('warning', 'Erro!', 'Não foi possível registrar o participante.');
      }    
    });
  };

  /*$scope.getCep = function (){
    console.log($scope.people);
    var comp = $scope.people.cep;
    var cepurl = "https://viacep.com.br/ws/"+ comp + "/json/";
    var config = 
    { headers: 
      { 'Access-Control-Allow-Credentials' : 'true',
        'Access-Control-Allow-Headers' : 'Content-Type, X-Request-With, X-Requested-By',
        'Access-Control-Allow-Methods' : 'GET, OPTIONS',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Max-Age' : '86400',
        'Cache-Control' : 'max-age=3600, public',
        'Content-Type' : 'application/json; charset=utf-8',
        'Expires' : 'Tue, 10 May 2016 15:43:18 GMT'
      }
    };
    

    $http.get(cepurl, config)
      .success(function (res){
        console.log(res);
      })
      .error(function(err){
        console.log("Error!");
      });
  };*/

  //Section ListUser and UserByEmail
  vm.memberList = [];
  vm.memberDetail = {};

  $scope.getMemberList = function (){
    $http.get(vm.url)
      .success(function (res){
        vm.memberList = res;
      })
      .error(function(err){
        alert('warning',"Error! Cannot get Member. Check your network connection.");
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
        alert('warning',"Error! Cannot get Member. Check your network connection.");
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

});
app.$inject = ['$scope']; 