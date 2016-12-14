'use strict';

app.controller('RoomCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, globalized) {
  var actualHost = globalized;
  var vm = this;
  vm.state = $state;
  vm.url = actualHost + '/class';

  	//DefaultSettings
	$(document).ready(function(){
		$('#mainHeader').show();
		$('mainFooter').show();
		$("body").removeClass('not-occupied');
		$("body").removeClass('occupied');
	});

  $scope.room = {
      name: null,
      location: null,
      description: null,
      price: null,
      size: null
  };

  vm.check = {
    c1: null,
    c2: null,
    c3: null,
    c4: null,
    c5: null
  }

  vm.validateCheckDesc = function(){
    //FIX > Tirar Mockzinho, deixar dinamico.
    var newText = "Sala possuí ";
    var hasAtLeastOne = false;
    console.log(vm.check.c1);
    if(vm.check.c1){ newText = newText + "Projetor; "; hasAtLeastOne = true; }
    if(vm.check.c2){ newText = newText + "Ar Condicionado; "; hasAtLeastOne = true; }
    if(vm.check.c3){ newText = newText + "Mesa; "; hasAtLeastOne = true; }
    if(vm.check.c4){ newText = newText + "Ventilador; "; hasAtLeastOne = true; }
    if(vm.check.c5){ newText = newText + "Tomada; "; hasAtLeastOne = true; }
    

    if(hasAtLeastOne == true){
      $scope.room.description = newText;
      vm.submit();
    }
    else{
      alert("warning", "Erro!", "O preenchimento dos itens com (*) é obrigatório. Verificar as informações dos campos em vermelho.");
    }
  };

  vm.submit = function () {
    $http.post(vm.url, $scope.room)
    .success(function (res) {
      alert('success','Ok!', 'Sala registrada com sucesso');
      $scope.openRoomDetail($scope.room.name, $scope.room.location);
    })
    .error(function (err) {
      if(err.message === 'Autenticação falhou') {
        alert('warning', 'Erro!', 'Você precisa estar autenticado para cadastrar uma sala.');
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


  vm.updateRoom = function(){

    var newText = "Sala possuí ";
    var hasAtLeastOne = false;
    console.log(vm.check.c1);
    if(vm.check.c1){ newText = newText + "Projetor; "; hasAtLeastOne = true; }
    if(vm.check.c2){ newText = newText + "Ar Condicionado; "; hasAtLeastOne = true; }
    if(vm.check.c3){ newText = newText + "Mesa; "; hasAtLeastOne = true; }
    if(vm.check.c4){ newText = newText + "Ventilador; "; hasAtLeastOne = true; }
    if(vm.check.c5){ newText = newText + "Tomada; "; hasAtLeastOne = true; }
    

    if(!hasAtLeastOne){
      alert("warning", "Erro!", "O preenchimento dos itens com (*) é obrigatório. Verificar as informações dos campos em vermelho.");
    }
    else{
      vm.newRoom = {
        name: vm.roomDetail.name,
        location: vm.roomDetail.location,
        typeClass: vm.roomDetail.typeClass,
        description: newText,
        size: vm.roomDetail.size,
        price: vm.roomDetail.price
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
    }
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

});
app.$inject = ['$scope']; 