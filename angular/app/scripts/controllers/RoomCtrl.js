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

  
  //Prepare data for agenda SECTION:
  vm.roomForAgenda = {};
  
  vm.getRoomForAgenda = function(name, location){
    var newurl = vm.url + "/" + name + "&" + location;
    $http.get(newurl)
      .success(function (res){
        vm.roomForAgenda = res;
        vm.infos.roomID = res.id;
      })
      .error(function(err){
        alert('warning',"Error! Cannot Get Room. Check your network connection.");
      });
  };

  $scope.startAgendaProcess = function(name, location){
    $state.go('dateselection', { 
      name:name,
      location:location
    });
  };
  
  vm.initAgenda = function(){
    vm.getRoomForAgenda(vm.state.params.name, vm.state.params.location);
  }

  //DatePicker
  $('#datepicker').datepicker({
      altField: "#alternate",
      altFormat: "d/m/yy"
  });

  vm.agendaHours = ['06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
  vm.agendaMinutes = ['00','30'];

  vm.timeInit = {
    selectedDay: null,
    hour: null,
    min: null
  }

  vm.timeEnd = {
    hour: null,
    min: null
  }

  vm.isDateSelected = function(){
    var dt = document.getElementById('alternate').value;
    vm.timeInit.selectedDay = dt;
    if(vm.timeInit.selectedDay == null){
      return false;
    }
    return true;
  }
  vm.verifyDisp = function(){
    if(vm.timeInit.hour != null && vm.timeInit.min != null){
      return true;
    }
    return false;
  }

  //WizardControl
  vm.flowStep = 0;
  vm.validateStep = function(num){
    if(vm.flowStep == num){
      return true;
    } else {
      return false;
    }
  }

  vm.agendaStepF = function(){
      vm.flowStep++;
  }

  vm.agendaStepB = function(){
    if(vm.flowStep >= 1){
      vm.flowStep--;
    }
  }

  vm.infos = {
    roomID : null,
    date : null,
    initTime : null,
    endTime : null,
    responsable : null,
    subject : null,
    description : null,
    type : null,
    timecreation : null
  }

});
app.$inject = ['$scope']; 