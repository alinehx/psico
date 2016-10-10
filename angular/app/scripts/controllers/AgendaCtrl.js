'use strict';

app.controller('AgendaCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, $cookies) {
  var vm = this;
  vm.state = $state;
  vm.urlAgenda = 'http://localhost:1337/agenda';
  vm.urlRemaneja = 'http://localhost:1337/remaneja';
  vm.urlGuest = 'http://localhost:1337/guest';
  vm.urlRoom = 'http://localhost:1337/class';

  //SETTINGS SECTION
  vm.agendaTypes = ['Treinamento', 'Consulta', 'Reunião'];
  vm.agendaHours = ['06:00','06:30','07:00','07:30','08:00',
    '08:30','09:00','09:30','10:00','10:30','11:00','11:30',
    '12:00','12:30','13:00','13:30','14:00','14:30','15:00',
    '15:30','16:00','16:30','17:00','17:30','18:00','18:30',
    '19:00','19:30','20:00','20:30','21:00','21:30','22:00',
    '22:30','23:00','23:30'];

  //ALL VARIABLES
  vm.step = 0;
  vm.userHasAgenda = false;
  vm.agendaDetail = {};
  vm.roomForAgenda = {};
  vm.agendaListForHour = {};
  vm.agendaDetails = {};
  vm.agendaList = [];
  vm.roomList = [];
  vm.guestList = [];

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

  //Configs
  vm.setUpPage = function(){
    vm.getRoomList();
  }

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
    guestQuantity: null,
    timecreation : null
  }

  //Necessary Objects Load
  vm.getRoomList = function (){
    $http.get(vm.urlRoom)
      .success(function (res){
        vm.roomList = res;
      })
      .error(function(err){
        alert('warning',"Error! Cannot Get RoomList. Check your network connection.");
      });
  };

  //Guest Section
  
  vm.guest = {
    agenda: null,
    email: null
  };
  vm.guestMail = {
    email: null
  };

  vm.newGuests = [];
  vm.addNewGuest = function(){
    var res = vm.newGuests.indexOf(vm.guestMail.email);
    var mailok = vm.validateGuestMail();
    if(res == -1 && mailok){
      vm.newGuests.push(vm.guestMail.email);
    }else{
      alert('warning', 'Erro!', "Email inválido: '" + vm.guestMail.email + "'.");
    }
  }

  vm.addToGuestList = function() {
    var res = vm.guestList.indexOf(vm.guestMail.email);
    var mailok = vm.validateGuestMail();
    if(res == -1 && mailok){
      vm.guestList.push(vm.guestMail.email);
    } else {
      alert('warning', 'Erro!', "Email inválido: '" + vm.guestMail.email + "'.");
    }
  }

  vm.getListSize = function(){
    if(vm.guestList.length > 0){
      return true;
    }
    return false;
  }

  vm.removeGuestFromList = function(item) {
    var pos = vm.guestList.indexOf(item);
    vm.guestList.splice(pos, 1);
  }

  vm.openGuestConfirmPage = function(item){
    vm.auxArray = vm.guestList;
    var pos = vm.guestList.indexOf(item);
    var guestObj = vm.guestList.splice(pos, 1);
    $state.go('acceptpage', { 
      guest: guestObj[0].guest,
      agenda: guestObj[0].agenda
    });
  }

  vm.populateGuests = function(guestList, agendaID) { //Recieves the selected list of guests and insert it to db.
    var succ = null;
    guestList.forEach(function(item){
      var guest = {
        agenda: agendaID,
        guest: item
      }
      $http.post(vm.urlGuest, guest)
      .success(function(res){
        succ = true;
      })
      .error(function(err){
        if(err.message === 'Autenticação falhou') {
          alert('warning', 'Erro!', 'Para adicionar convidados é necessario estar atuenticado.');
        } else {
          alert('warning', 'Erro!', 'Algo inesperado aconteceu, nao foi possivel inserir o convidado na agenda.');
        }
      });
    });
    if(succ){
      alert('success','Concluido!', 'Agendamento efetuado com sucesso.');
    }
  }

  vm.updateGuestStatus = function(guest){ //Udate a guest acceptance state for a agenda.
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

  vm.removeGuest = function(guest){ //Removes a guest from a agenda.
    var preparedUrl = vm.urlGuest + "/" + guest.agenda + "&" + guest.guest;
    $http.delete(preparedUrl)
    .success(function(res){
      alert('success','Sucesso!', 'Agendamento registrado com sucesso.');
    })
    .error(function(err){
      alert('warning',"Error!", "Não foi possivel executar a requisição." + err);
    });
  }

  vm.getGuestsByAgenda = function(agendaID){ //Get all guests in determined agenda.
    var newurl = vm.urlGuest + "/" + agendaID;
    $http.get(newurl)
    .success(function (res){
      vm.guestList = res;
      for(var i in res){
        vm.newGuests.push(res[i].guest);
      }
    })
    .error(function(err){
      alert('warning',"Error! Não foi possivel executar a requisição.");
    });
  }

  //Agenda Section
  vm.configureAgendaAndSubmit = function(){
    var configuredDate = Date(vm.agenda.date);
    var agendaModel = {
      roomID : vm.agenda.roomID,
      date : configuredDate,
      initTime : vm.agenda.initTime,
      endTime : vm.agenda.endTime,
      responsable : vm.loggedUser.email,
      subject : vm.agenda.subject,
      description : vm.agenda.description,
      type : vm.agenda.type,
      guestQuantity: vm.guestList.length,
      timecreation :  new Date().getTime()
    }
    vm.submit(agendaModel);
  }

  vm.submit = function (agenda) {
    $http.post(vm.urlAgenda, agenda)
    .success(function (res) {
      vm.populateGuests(vm.guestList ,res.agenda.id);//Populate Guest list in DB
      vm.openAgendaDetails(res.agenda.id);
    })
    .error(function (err) {
      if(err.message === 'Autenticação falhou') {
        alert('warning', 'Erro!', 'Para agendamentos é necessario estar atuenticado.');
      } else {
        alert('warning', 'Erro!', 'Não foi possivel executar a requisição. ' + err);
      }
    });
  };

  vm.updateAgenda = function(agenda){
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
  
  vm.loadAgendaInfo = function(agendaID){
    var newurl = vm.urlAgenda + "/a/" + agendaID;
    $http.get(newurl)
    .success(function (res){
      vm.agendaDetails = res;
      vm.getGuestsByAgenda(agendaID);
      vm.getRoom(vm.agendaDetail.roomID);
    })
    .error(function(err){
      alert('warning',"Error! Não foi possivel executar a requisição. " + err);
    });
  }
  
  vm.getAgendaForUser = function (){
    vm.agendaList = $cookies.getObject('userAgendas');
    if(vm.agendaList.length > 0){
      vm.userHasAgenda = true;
    } else {
      vm.userHasAgenda = false;
    }
  };

  vm.updateAgenda = function(){
    var newurl = vm.url + "/" + vm.userMail;
    $http.put(newurl, vm.newUser)
      .success(function (res){
        alert('success',"Dados alterados com sucesso!");
      })
      .error(function(err){
        alert('warning', "Error! Cannot Update User. Check your network connection.");
      });
  };


  vm.deleteAgendaInfo = function(id){
    //TODO ENVIAR EMAIL PARA TODOS OS PARTICIPANTES E PARA O RESPONSAVEL.
    //Deleting guests first.
    vm.guestList.forEach(function(guest){
      vm.removeGuest(guest);
    });

    vm.deleteAgenda(id);
  };

  //FIX
  vm.deleteAgenda = function(id){
    var newurl = vm.urlAgenda + "/" + id;
    $http.delete(newurl)
      .success(function (res){
        alert('success',"Agendamento cancelado!");
        $state.go('main');
      })
      .error(function(err){
        alert('warning', "Error! Não foi possivel cancelar o agendamento, tente novamente mais tarde");
      });
  };

  vm.openAgendaDetails = function(agendaID){
    $state.go('agendadetails', { 
      agendaID: agendaID
    });
  };

  //ROOM SETS
  vm.getRoomForAgenda = function(name, location){
    var newurl = vm.urlRoom + "/" + name + "&" + location;
    $http.get(newurl)
      .success(function (res){
        vm.roomForAgenda = res;
        vm.agenda.roomID = res.id;
      })
      .error(function(err){
        alert('warning',"Error! Cannot Get Room. Check your network connection.");
      });
  };

  vm.agendaRoom = {};
  vm.getRoom = function(id, location){

    $http.get(vm.urlRoom)
      .success(function (res){
        for(var item in res){
          if (res[item].id == vm.agendaDetails.roomID){
            vm.agendaRoom = res[item];
            var dt = res[item].date;
            
          }
        }

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
    vm.getHourForAgenda();
  }

  vm.getHourForAgenda = function (hour){
    $http.get(vm.urlAgenda)
    .success(function (res){
      vm.agendaListForHour = res;
    })
    .error(function(err){
      alert('warning',"Error! Não foi possivel executar a requisição. " + err);
    });
  };

  //DatePicker
  $('#datepicker').datepicker({
      altField: "#alternate",
      altFormat: "dd/mm/yy"
      //altFormat: "d MM, yy" -> 18 SETEMBRO, 2016
  });

  vm.selectEndHour = function(hr, source){
    var goodHour = vm.verifyHourForRoom(hr);
    if(goodHour == true){
      vm.agenda.endTime = hr;
      source.labelValue = hr;
      vm.doFinish(source);
    }
  }

  vm.selectHour = function(hr, source){
    var goodHour = vm.verifyHourForRoom(hr);
    if(goodHour == true){
      vm.agenda.initTime = hr;
      source.labelValue = hr;
      vm.doFinish(source);
    }
  }

  //FIXMARCEL
  vm.validateHourAvailability = function(time){
    var configuredDate = Date(vm.agenda.date);
    var initUrl = vm.urlAgenda + "/in/" + configuredDate + "&" + time;
    var endUrl = vm.urlAgenda + "/en/" + configuredDate + "&" + time;

    $http.get(initUrl)
    .success(function (res){
      var r = vm.checkEndTime(endUrl);
      if(r == null){
        return false;
      } else {
        if(res == null){
          return false;
        } else {
          return true;
        }
      }
    })
    .error(function(err){
      alert('warning',"Error! Não foi possivel executar a requisição. " + err);
    });
  }
  //FIXMARCEL
  vm.checkEndTime = function(endUrl){
    $http.get(endUrl)
    .success(function (res){
      return res;
    })
    .error(function(err){
      alert('warning',"Error! Não foi possivel executar a requisição. " + err);
    });
  }

  //FIXMARCEL
  vm.requestRemaneja = function(hr){
    //SHOULD BUILD THE REMANEJA
    $http.post(vm.urlAgenda)
    .success(function (res){
      return res;
    })
    .error(function(err){
      alert('warning',"Error! Não foi possivel executar a requisição. " + err);
    });

    $http.post(vm.urlRemaneja, rema)
    .success(function (res){
      return res;
    })
    .error(function(err){
      alert('warning',"Error! Não foi possivel executar a requisição. " + err);
    });
  }

  //should be used to set 'next' button clickable.
  vm.isDateSelected = function(){ 
    var dt = document.getElementById('alternate').value;
    vm.agenda.date = dt;
    vm.blockDate.labelValue = dt;
    if(vm.agenda.date == null){
      return false;
    }
    return true;
  }

  //Used for validation in details
  vm.isDataFilled = function(){
    if(vm.agenda.subject != null && vm.agenda.description != null && vm.agenda.type != null){
      return true;
    }
    return false;
  }

  //NEW MODEL SECETION
  vm.blockDate = {
    labelText: "Selecione a Data",
    labelValue: null,
    isFinished: false
  }
  vm.blockHourInit = {
    labelText: "Selecione a Hora de Inicio",
    labelValue: null,
    isFinished: false
  }
  vm.blockHourEnd = {
    labelText: "Selecione a Hora de Termino",
    labelValue: null,
    isFinished: false
  }
  vm.blockDetail = {
    labelText: "Preencha os detalhes",
    labelValue: null,
    isFinished: false
  }
  vm.blockGuest = {
    labelText: "Adicione os Participantes",
    labelValue: null,
    isFinished: false
  }

  //VALIDATIONS
  vm.checkFinished = function(source){
    return source.isFinished;
  }

  vm.isDataSelected = function(source){
    if(source != null){
      return true;
    }
    return false;
  }

  vm.isActualStep = function(step){
    if(vm.step == step){
      return true;
    }
    return false;
  }

  vm.doFinish = function(source){
    source.isFinished = true;
    vm.step++;
  }

  vm.unFinish = function(source){
    if(vm.step >= 1){
      source = false;
      vm.step--;
      if(vm.step == 2){
        vm.blockHourEnd.labelValue = null;
      }
      if(vm.step == 1){
        vm.blockHourInit.labelValue = null;
      }
    }
  }

});
app.$inject = ['$scope']; 