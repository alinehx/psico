'use strict';

app.controller('AgendaCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, $cookies, globalized) {
  var actualHost = globalized;
  var vm = this;
  vm.state = $state;
  vm.urlAgenda = actualHost + '/agenda';
  vm.urlRemaneja = actualHost + '/remaneja';
  vm.urlGuest = actualHost + '/guest';
  vm.urlRoom = actualHost + '/class';
  vm.urlHour = actualHost + '/hours';

  //SETTINGS SECTION
  vm.agendaTypes = ['Treinamento', 'Consulta', 'Reunião'];
  vm.agendaHours = [
    ['06:00',1],['06:30',2],['07:00',3],['07:30',4],['08:00',5],['08:30',6],['09:00',7],['09:30',8],['10:00',9],['10:30',10],['11:00',11],['11:30',12],['12:00',13],['12:30',14],['13:00',15],['13:30',16],['14:00',17],['14:30',18],['15:00',19],['15:30',20],['16:00',21],['16:30',22],['17:00',23],['17:30',24],['18:00',25],['18:30',26],['19:00',27],['19:30',28],['20:00',29],['20:30',30],['21:00',31],['21:30',32],['22:00',33],['22:30',34],['23:00',35],['23:30',36]
  ];

  //ALL VARIABLES
  vm.step = 0;
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
  };

  vm.fieldNotEmpty = function(field){
    var response = true;
    if (field == '' || field == null){
      response = false;
    }
    return response;
  };

  //Configs
  vm.setUpPage = function(){
    vm.getRoomList();
  };

  vm.loggedUser = {
    email: $cookies.get('loggedUserMail'),
    name: $cookies.get('loggedUserName')
  };

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
    timecreation : null,
    active:true
  };

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
  };

  vm.addToGuestList = function() {
    var res = vm.guestList.indexOf(vm.guestMail.email);
    var mailok = vm.validateGuestMail();
    if(res == -1 && mailok){
      vm.guestList.push(vm.guestMail.email);
    } else {
      alert('warning', 'Erro!', "Email inválido: '" + vm.guestMail.email + "'.");
    }
  };

  vm.getListSize = function(){
    if(vm.guestList.length > 0){
      return true;
    }
    return false;
  };

  vm.removeGuestFromList = function(item) {
    var pos = vm.guestList.indexOf(item);
    vm.guestList.splice(pos, 1);
  };

  vm.openGuestConfirmPage = function(item){
    vm.auxArray = vm.guestList;
    var pos = vm.guestList.indexOf(item);
    var guestObj = vm.guestList.splice(pos, 1);
    $state.go('acceptpage', { 
      guest: guestObj[0].guest,
      agenda: guestObj[0].agenda
    });
  };

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
  };

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
      alert('warning',"Error!", "Não foi possivel executar a requisição." + err.message);
    });
  };

  vm.removeGuest = function(guest){ //Removes a guest from a agenda.
    var preparedUrl = vm.urlGuest + "/" + guest.agenda + "&" + guest.guest;
    $http.delete(preparedUrl)
    .success(function(res){
      alert('success','Sucesso!', 'Agendamento registrado com sucesso.');
    })
    .error(function(err){
      alert('warning',"Error!", "Não foi possivel executar a requisição." + err.message);
    });
  };

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
  };

  //Agenda Section
  vm.configureAgendaAndSubmit = function(){
    var configuredDate = vm.configureDate(vm.agenda.date);
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
      timecreation :  new Date().getTime(),
      active: true
    }
    vm.submit(agendaModel);
  };

  vm.submit = function (agenda) {
    $http.post(vm.urlAgenda, agenda)
    .success(function (res) {
      vm.populateGuests(vm.guestList ,res.agenda.id);//Populate Guest list in DB
      vm.openAgendaDetails(res.agenda.id);
      vm.saveHours(res.agenda.id);
    })
    .error(function (err) {
      if(err.message === 'Autenticação falhou') {
        alert('warning', 'Erro!', 'Para agendamentos é necessario estar atuenticado.');
      } else {
        alert('warning', 'Erro!', 'Não foi possivel executar a requisição. ' + err.message);
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
      alert('warning',"Error!", "Não foi possivel executar a requisição." + err.message);
    });
  };
  
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
      alert('warning',"Error! Não foi possivel executar a requisição. " + err.message);
    });
  };
  
  vm.getAgendaForUser = function (){
    var newurl = vm.urlAgenda + "/" + vm.loggedUser.email;
    $http.get(newurl)
    .success(function (res){
      res.forEach(function(item){
        if(item.active == true){
          vm.agendaList.push(item);
        }
      });
    })
    .error(function(err){
      alert('warning', "Error! Cannot Update User. Check your network connection.");
    });
  };

  vm.userHasAgenda = function(){
    if(vm.agendaList.length > 0){
      return true;
    } else {
      return false;
    }
  }

  vm.getActiveAgendasForUser = function(){
    var newUrl = vm.urlAgenda + "/" + vm.loggedUser.email;
    var deactivated = {
      active: false
    };
    $http.put(newurl, deactivated)
    .success(function (res){
      alert('success',"Dados alterados com sucesso!");
    })
    .error(function(err){
      alert('warning', "Error! Cannot Update User. Check your network connection.");
    });
  }

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


  vm.deleteAgendaInfo = function(agenda){
    //TODO ENVIAR EMAIL PARA TODOS OS PARTICIPANTES E PARA O RESPONSAVEL.
    //Deleting guests first.
    vm.guestList.forEach(function(guest){
      vm.removeGuest(guest);
    });
    vm.getHourForAgendaCancellation(agenda.id);
    vm.deleteAgenda(agenda.id);
  };


  //FIX
  vm.deleteAgenda = function(id){
    var newAgenda = {
      active: false,
    };
    var newurl = vm.urlAgenda + "/" + id;
    $http.put(newurl, newAgenda)
      .success(function (res){
        alert('success',"Agendamento cancelado!");
        console.log(res);
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

  vm.backToMain = function(){
    $state.go('main');
  }

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

  vm.initAgenda = function(){
    vm.isbyroom = true;
    vm.getRoomForAgenda(vm.state.params.name, vm.state.params.location);
  };

  vm.loadedHours = {};
  vm.isbyroom = false;
  vm.validateHourSettings = function(){
    if(vm.isbyroom){
      var configuredDate = document.getElementById('alternate').value;
      var newUrl = vm.urlHour + '/' + vm.replaceAll(configuredDate, '/', '-') + "&" + vm.agenda.roomID;
      $http.get(newUrl)
      .success(function (res){
        vm.loadedHours = {};
        if(res == null || res.length == 0){
          vm.agendaHours.forEach(function(h){
            vm.createHoursForDay(h[0], h[1], configuredDate);
          })
        } else {
          vm.loadedHours = res.sort(function(a, b) {
              return a.num - b.num;
          });
        }
      })
      .error(function(err){
        alert('warning',"Error! Não foi possivel executar a requisição. " + err.message);
      });
    }
  };

  vm.createHoursForDay = function(hour, num, day){
    var thisDate = day;
    thisDate = vm.replaceAll(thisDate, '/', '-');
    var hours = {
      room: vm.agenda.roomID,
      date: thisDate,
      hour: hour,
      num: num
    };
    $http.post(vm.urlHour, hours)
    .success(function (res){

    })
    .error(function(err){
      if(err.message != "Horário já Existe"){
        alert('warning',"Error! Não foi possivel executar a requisição. " + err.message);
      }
    });
  };

  //DatePicker
  $('#datepicker').datepicker({
      altField: "#alternate",
      altFormat: "dd/mm/yy"
      //altFormat: "d MM, yy" -> 18 SETEMBRO, 2016
  });

  $('#datepicker').change(function (){
    vm.validateHourSettings();
  });

  vm.validateHour = function(hr){
    if(hr.available && vm.agenda.initTime != hr.hour){
      return true;
    }
    return false;
  }

  vm.availableRange = [];
  vm.validateHourRange = function(ini, en){
    var init = ini.num;
    var end = en.num;
    var isOk = true;
    var availableRange = [];
    vm.loadedHours.forEach(function(item){
      var actual = item.num;
      if (actual >= init && actual < end){
        availableRange.push(item);
        if(!item.available){
          isOk = false;
        }
      }
    });
    if(isOk){
      vm.availableRange = availableRange;
    }
    return isOk;
  }

  vm.selectEndHour = function(hr, source){
    var goodHour = hr.available;
    if(goodHour && vm.agenda.initTime != hr.hour){
      if(vm.validateHourRange(vm.auxHour, hr)){
        vm.agenda.endTime = hr.hour;
        source.labelValue = hr.hour;
        vm.doFinish(source);
      } else{
        alert('warning',"Já existe algum agendamento entre os horarios selecionados.");
      }
    }
  };

  vm.auxHour = {};
  vm.selectHour = function(hr, source){
    var goodHour = hr.available;
    if(goodHour){
      vm.auxHour = hr;
      vm.agenda.initTime = hr.hour;
      source.labelValue = hr.hour;
      vm.doFinish(source);
    }
  };

  vm.saveHours = function(agenda){
    vm.availableRange.forEach(function(item){
      vm.putHour(item.id, agenda);
    })
  }
  
  vm.putHour = function(hour, agenda){
    var newUrl = vm.urlHour + "/" + hour;
    var newHour = {
      id: hour,
      available: false,
      agenda: agenda
    }
    $http.put(newUrl, newHour)
    .success(function(res){
    })
    .error(function(err){
      alert('warning',"Error!", "Não foi possivel executar a requisição." + err.message);
    });
  }

   vm.getHourForAgendaCancellation = function (agenda){
    var newUrl = vm.urlHour + "/u/" + agenda;
    $http.get(vm.urlHour)
    .success(function (res){
      res.forEach(function(item){
        vm.cleanHourSettings(item);
      });
    })
    .error(function(err){
      alert('warning',"Error! Não foi possivel executar a requisição. " + err.message);
    });
  };

  vm.cleanHourSettings = function(hour){
    var newUrl = vm.urlHour + "/" + hour;
    var newHour = {
      available: false,
      agenda: null
    }
    newHour.agenda=null;
    newHour.available = true;
    $http.put(newUrl, newHour)
    .success(function(res){

    })
    .error(function(err){
      alert('warning',"Error!", "Não foi possivel executar a requisição." + err.message);
    });
  };

  vm.remanejaForAgenda = function (hour){
    var agendaUrl = vm.urlAgenda + "/a/" + hour.agenda;
    var rema = {
      agenda: hour.agenda,
      target: vm.loggedUser.email,
      owner: null
    }
    $http.get(agendaUrl)
    .success(function (res){
      rema.owner = res.responsable;
      vm.requestRemaneja(rema);
    })
    .error(function(err){
      alert('warning',"Error! Não foi possivel executar a requisição. " + err.message);
    });
  };

  vm.requestRemaneja = function(rema){
    $http.post(vm.urlRemaneja, rema)
    .success(function (res){
      alert('success',"Remanejamento solicitado com sucesso!");
      vm.gotoRemaneja(res.id);
    })
    .error(function(err){
      alert('warning',"Error! Não foi possivel executar a requisição. " + err.message);
    });
  };

  vm.rangeHours = [];
  vm.generateHoursToSelect = function(){
    var range = [];
    console.log("eita");
    vm.agendaHours.forEach(function(h){
      range.push(h[0]);
    });
    vm.rangeHours = range;
  };

  vm.gotoRemaneja = function(id){
    $state.go('remaneja', { 
      id: id
    });
  };

  vm.gotoSelectByCalendar = function(id){
    $state.go('selectbycalendar', { 
      id: id
    });
  };

  //GETBYDATEFIRST VARIABLES
  vm.allSalas = [];
  vm.allUnavailableHours = [];
  vm.allAvailableRooms = [];
  vm.byDayDate = null;
  vm.byDayInitHour = null;
  vm.byDayEndHour = null;

  vm.getAllSalas = function(){
    $http.get(vm.urlRoom)
    .success(function (res){
      alert('success',"Remanejamento solicitado com sucesso!");
      vm.allSalas = res;
      vm.findAvailableRooms();
    })
    .error(function(err){
    });
  };

  vm.startLookingForAvailableRooms = function(){
    vm.allAvailableRooms = [];
    var date = document.getElementById('alternate').value;
    date = vm.replaceAll(date, '/', '-');

    var newurl = vm.urlHour + "/r/" + date;
    $http.get(newurl)
    .success(function (res){
      alert('success',"Remanejamento solicitado com sucesso!");
      vm.allUnavailableHours = res;
      vm.getAllSalas();
    })
    .error(function(err){
    });
  };

  vm.setDateToMDY = function(old){
    var arr = old.split('-');
    var newdate = arr[1] + "-" + arr[0] + "-" + arr[2];
    return newdate;
  };

    vm.findAvailableRooms = function(){
    var selectedRange = [];
    vm.allSalas.forEach(function(sala){

      var isBetween = false;
      var isOver = false;
      vm.agendaHours.forEach(function(item){
        if(item[0] == vm.agenda.initTime){
          isBetween = true;
        }

        if(item[0] == vm.agenda.endTime){
          isOver = true;
        }

        if(isBetween && !isOver){
          selectedRange.push(item[1]);
        }
      });

      var check = true;
      vm.allUnavailableHours.forEach(function(hora){
        
        if(hora.room == sala.id){
          selectedRange.forEach(function(hh){
            if(hh == hora.num){
              console.log("sala", sala.id);
              console.log("Hora", hh);
              check = false;
            }
          });
        }
      });

      if(check){
        vm.allAvailableRooms.push(sala);
      }
    });

    vm.doFinish(null);
  };

  vm.chooseRoom = function(roomID){
    vm.agenda.roomID = roomID;
    vm.doFinish(null);
  };

  vm.prepareHours = function(){
    vm.validateHourSettings();
    vm.doFinish(vm.blockDate);
  };

  //should be used to set 'next' button clickable.
  vm.isDateSelected = function(){ 
    var dt = document.getElementById('alternate').value;
    if(dt.length <1){ //To avoid breaking the code.
      dt = document.getElementById('datepicker').value;
    }
    vm.agenda.date = dt;
    
    vm.blockDate.labelValue = dt;
    if(vm.agenda.date == null){
      return false;
    }
    return true;
  };

  //Used for validation in details
  vm.isDataFilled = function(){
    if(vm.agenda.subject != null && vm.agenda.description != null && vm.agenda.type != null){
      return true;
    }
    return false;
  };

  //NEW MODEL SECETION
  vm.blockDate = {
    labelText: "Selecione a Data",
    labelValue: null,
    isFinished: false
  };
  vm.blockHourInit = {
    labelText: "Selecione a Hora de Inicio",
    labelValue: null,
    isFinished: false
  };
  vm.blockHourEnd = {
    labelText: "Selecione a Hora de Termino",
    labelValue: null,
    isFinished: false
  };
  vm.blockDetail = {
    labelText: "Preencha os detalhes",
    labelValue: null,
    isFinished: false
  };
  vm.blockGuest = {
    labelText: "Adicione os Participantes",
    labelValue: null,
    isFinished: false
  };

  //VALIDATIONS
  vm.checkFinished = function(source){
    return source.isFinished;
  };

  vm.isDataSelected = function(source){
    if(source != null){
      return true;
    }
    return false;
  };

  vm.isActualStep = function(step){
    if(vm.step == step){
      return true;
    }
    return false;
  };

  vm.doFinish = function(source){
    if(source == null){
      vm.step++;
    }else{
      vm.step++;
      source.isFinished = true;
    }
  };

  vm.unFinish = function(source){
    if(source == null){
      if(vm.step == 0){
        $state.go('agendatypes');
      } else {
        vm.step--;
      }
    } else {
      source.isFinished = false;
      source.labelValue = null;
      if(vm.step >= 1){
        vm.step--;
        if(vm.step == 2){
          vm.blockHourEnd.labelValue = null;
        }
        if(vm.step == 1){
          vm.blockHourInit.labelValue = null;
        }
      }
    }
  };

  //UTILS:
  vm.replaceAll = function(text, cTarget, cNew){
    while(text.match(cTarget) != null){
      var res = text.search(cTarget);
      if(res != -1){
        text = text.replace(cTarget, cNew);
      }
    }
    return text;
  }

  vm.configureDate = function(date){
    var newDate = new Date();
    var arr = date.split('/');

    newDate.setDate(arr[0]);
    newDate.setMonth((arr[1]-1));
    newDate.setYear(arr[2]);
    
    return newDate
  }

  //Redirection:
  vm.gotoRoomSelection = function(){
    $state.go('roomselection');
  };

});
app.$inject = ['$scope']; 