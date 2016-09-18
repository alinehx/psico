'use strict';

app.controller('AgendaCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, $cookies) {
  var vm = this;
  vm.state = $state;
  vm.urlAgenda = 'http://localhost:1337/agenda';
  vm.urlGuest = 'http://localhost:1337/guest';
  vm.urlUser = 'http://localhost:1337/member';
  vm.urlRoom = 'http://localhost:1337/class';

  //Validations
  vm.validateGuestMail = function(){
    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    var response = true;
    if (vm.guestMail.email == '' || !re.test(vm.guestMail.email)){
         response = false;
    }
    return response;
  }

  vm.fieldNotEmpty = function(field){
    var response = true;
    if (field == '' || field == null){
      response = false;
    }
    return response;
  }

  vm.valiDate = function(){
    //if nulls, FALSE!
    if(vm.init.day == null || vm.end.day == null || vm.init.hour == null || vm.init.min == null || vm.end.hour == null || vm.end.min == null){
      return false;
    }
    
    var response = false;
    var iDate = vm.init.day;
    var eDate = vm.end.day;

    iDate.setHours(vm.init.hour, vm.init.min, 0);
    eDate.setHours(vm.end.hour, vm.end.min, 0);

    console.log("init: ", iDate.getTime());
    console.log("end: ", eDate.getTime());
    
    if(vm.initDay != null && vm.endDay != null){
      if(eDate.getTime() - iDate.getTime() > 0){
        response = true;
      }
    }
    return response;
  }

  //Configs
  vm.isAvailable = false;
  vm.setUpPage = function(){
    vm.getRoomList();
  }
  vm.populateGuests = populateGuests;
  vm.updateGuestStatus = updateGuestStatus;
  vm.removeGuest = removeGuest;
  vm.getGuestsByAgenda = getGuestsByAgenda;

  vm.loggedUser = {
    email: $cookies.get('loggedUserMail'),
    name: $cookies.get('loggedUserName')
  }

  vm.agenda = {
    roomID : null,
    date : null,
    initTime : null,
    endTime : null,
    responsable : vm.loggedUser.email,
    subject : null,
    description : null,
    type : null,
    timecreation : null
  }

  //Necessary Objects Load
  vm.getRoomList = function (){
    $http.get(vm.urlRoom)
      .success(function (res){
        vm.roomList = res;
        vm.roomID = res.id;
      })
      .error(function(err){
        alert('warning',"Error! Cannot Get RoomList. Check your network connection.");
        console.log(err);
      });
  };

  vm.typeList = ["", "Consulta", "Palestra", "Reuniao", "Treinamento"];
  vm.roomList = [];
  
  //Guest Section
  vm.guestList = [];
  vm.responseGuestList = [];
  vm.guest = {
    agenda: null,
    email: null
  };
  vm.guestMail = {
    email: null
  };

  vm.addToGuestList = function() {
    var res = vm.guestList.indexOf(vm.guestMail.email);
    var mailok = vm.validateGuestMail();
    if(res == -1 && mailok){
      vm.guestList.push(vm.guestMail.email);
    }else{
      alert('warning', 'Erro!', "Email inválido: '" + vm.guestMail.email + "'.");
    }
  }

  vm.removeGuestFromList = function(item) {
    var pos = vm.guestList.indexOf(item);
    vm.guestList.splice(pos, 1);
  }

  var populateGuests = function(guestList, agendaID) { //Recieves the selected list of guests and insert it to db.
    guestList.forEach(function(item){
      var guest = {
        ageda: agendaID,
        email: item
      }
      $http.post(vm.urlGuest, guest)
      .success(function(res){
        console.log("Guest cadastrado com sucesso na agenda " + agendaID + ".");
      })
      .error(function(err){
        if(err.message === 'Autenticação falhou') {
          alert('warning', 'Erro!', 'Para adicionar convidados é necessario estar atuenticado.');
        } else {
          alert('warning', 'Erro!', 'Algo inesperado aconteceu, nao foi possivel inserir o convidado na agenda.');
        }
      });
    });
  }

  var updateGuestStatus = function(guest){ //Udate a guest acceptance state for a agenda.
    var preparedUrl = vm.urlGuest + "/" + guest.agenda + "&" + guest.email;
    var newGuestStatus = {
      accepted: !guest.accepted
    }

    $http.put(preparedUrl, newGuestStatus)
    .success(function(res){
      alert('success','Sucesso!', 'Resposta para agendamento efetuada com sucesso.');
    })
    .error(function(err){
      alert('warning',"Error!", "Não foi possivel executar a requisição." + err);
    });
  }

  var removeGuest = function(guest){ //Removes a guest from a agenda.
    var preparedUrl = vm.urlGuest + "/" + guest.agenda + "&" + guest.email;
    
    $http.delete(preparedUrl, newGuestStatus)
    .success(function(res){
      alert('success','Sucesso!', 'Agendamento registrado com sucesso.');
    })
    .error(function(err){
      alert('warning',"Error!", "Não foi possivel executar a requisição." + err);
    });
  }

  var getGuestsByAgenda = function(agendaID){ //Get all guests in determined agenda.
    var newurl = vm.urlGuest + "/" + agendaID;
    $http.get(newurl)
    .success(function (res){
      vm.responseGuestList = res;
    })
    .error(function(err){
      alert('warning',"Error! Não foi possivel executar a requisição.");
    });
  }

  //Agenda Section
  vm.init = {
    day: null,
    hour: null,
    min: null
  }
  
  vm.end = {
    day: null,
    hour: null,
    min: null
  }

  vm.agendaDetail = {};
  vm.agendaList = [];

  vm.submit = function () {
    $http.post(vm.urlAgenda, vm.agenda)
    .success(function (res) {
      alert('success','Sucesso!', 'Agendamento registrado com sucesso.');
      var agendaID = res.id;
      
    // populateGuests(guestList, agendaID);
    //Implementar openAgendaDetails
    })
    .error(function (err) {
      if(err.message === 'Autenticação falhou') {
        alert('warning', 'Erro!', 'Para agendamentos é necessario estar atuenticado.');
      } else {
        alert('warning', 'Erro!', 'Não foi possivel executar a requisição. ' + err);
      }    
    }); 
  };

  var updateAgenda = function(agenda){
    var preparedUrl = vm.urlAgenda + "/" + agenda.id;
    var newAgenda = {
      data: vm.agendaDetail.data,
      type: vm.agendaDetail.type
    };

    $http.put(preparedUrl, newGuestStatus)
    .success(function(res){
      alert('success','Sucesso!', 'Resposta para agendamento efetuada com sucesso.');
    })
    .error(function(err){
      alert('warning',"Error!", "Não foi possivel executar a requisição." + err);
    });
  }
  
  vm.getUserByEmail = function (email){
    var newurl = vm.urlUser + "/" + email;
    $http.get(newurl)
      .success(function (res){
        vm.userDetail = res;
        vm.userMail = vm.userDetail.email;
        vm.userDetail.createdAt = moment(vm.userDetail.createdAt).format("DD/MM/YYYY - HH:MM");
        vm.userDetail.updatedAt = moment(vm.userDetail.updatedAt).format("DD/MM/YYYY - HH:MM");
      })
      .error(function(err){
        alert('warning',"Error! Não foi possivel executar a requisição.");
      });
  };
  

  vm.userHasAgenda = false;
  vm.getAgendaForUser = function (){
    var newurl = vm.urlAgenda + "/" + vm.loggedUser.email;
    $http.get(newurl)
      .success(function (res){
        vm.agendaList = res;
        if(vm.agendaList.length > 0){
          vm.userHasAgenda = true;
        }
      })
      .error(function(err){
        alert('warning',"Error! Não foi possivel executar a requisição.");
      });
  };

  vm.updateAgenda = function(){
    vm.newAgenda = {
      date: vm.agendaDetails.a,
      timestamp: vm.agendaDetails.a,
      responsable: vm.agendaDetails.a,
      room: vm.agendaDetails.a,
      type: vm.agendaDetails.a,
      subject: vm.agendaDetails.a,
      description: vm.agendaDetails.a
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

  //FIX
  vm.deleteAgenda = function(){
    var newurl = vm.url + "/" + vm.userMail;
    $http.delete(newurl, vm.userDetail)
      .success(function (res){
        alert('success',"O Usuário "+ vm.userDetail.name + " foi desativado com sucesso!");
        $state.go('listofusers');
      })
      .error(function(err){
        alert('warning', "Error! Não foi possivel executar a requisição.");
      });
  };

  vm.openAgendaDetails = function(id){
    $state.go('agendadetails', { 
      id: id
    });
  };

  //ROOM SETS
  vm.roomForAgenda = {};
  
  vm.getRoomForAgenda = function(name, location){
    var newurl = vm.urlRoom + "/" + name + "&" + location;
    $http.get(newurl)
      .success(function (res){
        vm.roomForAgenda = res;
      })
      .error(function(err){
        alert('warning',"Error! Cannot Get Room. Check your network connection.");
      });
  };

  //Redirection:
  vm.gotoRoomSelection = function(){
    $state.go('roomselection');
  }

  //This is used in the display of Agendas for SlaveDevice
  vm.validateDateToShow = function(){

  }

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

  //should be used to set 'next' button clickable.
  vm.isDateSelected = function(){ 
    var dt = document.getElementById('alternate').value;
    vm.timeInit.selectedDay = dt;
    if(vm.timeInit.selectedDay == null){
      return false;
    }
    return true;
  }

  //NEW MODEL SECETION
  vm.blockDate = {
    labelText: "Selecione a Data",
    labelValue: null,
    isDataSelected: false,
    isFinished: false
  }
  vm.blockHourInit = {
    labelText: "Selecione a Hora de Inicio",
    labelValue: null,
    isDataSelected: false,
    isFinished: false
  }
  vm.blockHourEnd = {
    labelText: "Selecione a Hora de Termino",
    labelValue: null,
    isDataSelected: false,
    isFinished: false
  }
  vm.blockDetail = {
    labelText: "Preencha os detalhes",
    labelValue: null,
    isDataSelected: false,
    isFinished: false
  }
  vm.blockGuest = {
    labelText: "Adicione os Participantes",
    labelValue: null,
    isDataSelected: false,
    isFinished: false
  }

  //VALIDATIONS
  vm.isDataSelected = function(source){
    if(source != null){
      return true;
    }
    return false;
  }

  vm.step = 0;

  vm.isActualStep = function(step){
    if(vm.step == step){
      return true;
    }
    return false;
  }

  vm.doFinish = function(source){
    source = true;
    vm.step++;
  }

  vm.unFinish = function(source){
    if(vm.step >= 1){
      source = false;
      vm.step--;
    }
  }

});
app.$inject = ['$scope']; 