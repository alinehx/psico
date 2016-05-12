'use strict';

app.controller('RoomCtrl', function ($scope, $rootScope, $http, alert, authToken, $state) {
  var vm = this;
  vm.state = $state;
  $scope.tiposSala = ["Consulta", "Treinamento", "Reunião"];
  vm.url = 'http://localhost:1337/class';

  $scope.room = {
      name: null,
      location: null,
      typeClass: null,
      description: null,
      size: null
  };

  $scope.submit = function () {
    $http.post(vm.url, $scope.room)
    .success(function (res) {
      alert('success','Ok!', 'Sala registrada com sucesso');
      $scope.openRoomDetail($scope.room.name, $scope.room.location);
    })
    .error(function (err) {
      if(err.message === 'Autenticação falhou') {
        alert('warning', 'Erro!', 'Você precisa estar autenticado para cadastrar uma sala');
      } else {
    	  alert('warning', 'Erro!', 'Não foi possível registrar a sala.');
      }
    });	
  };

  //Section ListRoom and RoomByName
  vm.roomList = [];
  vm.roomDetail = {};

  $scope.getRoomList = function (){
    $http.get(vm.url)
      .success(function (res){
        vm.roomList = res;
      })
      .error(function(err){
        alert('warning',"Error! Cannot Get Rooms. Check your network connection.");
      });
  };
  $scope.getRoomByName = function (name, location){
    var newurl = vm.url + "/" + name + "&" + location;
    $http.get(newurl)
      .success(function (res){
        vm.roomDetail = res;
        vm.roomName = vm.roomDetail.name;
        vm.roomLocation = vm.roomDetail.location;
        vm.roomDetail.createdAt = moment(vm.roomDetail.createdAt).format("DD/MM/YYYY - HH:MM");
        vm.roomDetail.updatedAt = moment(vm.roomDetail.updatedAt).format("DD/MM/YYYY - HH:MM");
      })
      .error(function(err){
        alert('warning',"Error! Cannot Get Rooms. Check your network connection.");
      });
  };
  
  $scope.openRoomDetail = function(name, location){
    $state.go('rom', { 
      name:name,
      location:location
    });
  };

  //Section ManipulateRoomDetails
  vm.roomName = null;

  vm.editRoom = function(){
    vm.isEdt = true;
  };

  vm.updateRoom = function(){
    vm.newRoom = {
      name: vm.roomDetail.name,
      location: vm.roomDetail.location,
      typeClass: vm.roomDetail.typeClass,
      description: vm.roomDetail.description
    };
    var newurl = vm.url + "/" + vm.roomName + "&" + vm.roomLocation;
    $http.put(newurl, vm.newRoom)
      .success(function (res){
        alert('success',"Dados alterados com sucesso!");
        $state.go('listofrooms');
      })
      .error(function(err){
        alert('warning', "Error! Cannot Update Room. Check your network connection.");
      });
  };

  //Section DisableRoom and EnableRoom
  vm.killConfirm = false;
  vm.disableRoom = function(){
    var newurl = vm.url + "/" + vm.roomName + "&" + vm.roomLocation;
    $http.delete(newurl, vm.roomDetail)
      .success(function (res){
        alert('success',"A Sala "+ vm.roomDetail.name + " foi desativado com sucesso!");
        $state.go('listofrooms');
      })
      .error(function(err){
        alert('warning', "Error! Cannot Update Room. Check your network connection.");
      });
  };

  vm.enableRoom = function(){
    var newurl = vm.url + "/" + vm.roomName + "&" + vm.roomLocation;
    vm.newRoom = {
      active: true
    };
    $http.put(newurl, vm.newRoom)
      .success(function (res){
        alert('success',"A Sala "+ vm.roomDetail.name + " foi re-ativado com sucesso!");
        $state.go('listofrooms');
      })
      .error(function(err){
        alert('warning', "Error! Cannot Update Room. Check your network connection.");
      });
  };

  $scope.backToMain = function(){
    $state.go('main');
  };
});
app.$inject = ['$scope']; 