'use strict';
angular
  .module('psico2App').config(function ($urlRouterProvider, $stateProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/login');

    //Main Primary Section
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: '/views/login.html',
       controller: 'LoginCtrl as vm'
    });
    $stateProvider.state('main', {
      url: '/index',
      templateUrl: '/views/index.html',
      controller:"ConstantsCtrl as vm"
    });

    //User Control
    $stateProvider.state('registeruser', {
      url: '/registeruser',
      templateUrl: '/views/registeruser.html',
        controller: 'UserCtrl as vm'
    });
    $stateProvider.state('listofusers', {
      url: '/listofusers',
      templateUrl: '/views/listofusers.html',
        controller: 'UserCtrl as vm'
    });
    $stateProvider.state('usr', {
      url: '/usr/:email',
      templateUrl: '/views/userdetail.html',
       controller: 'UserCtrl as vm',
    });
    

    //Room Controler
    $stateProvider.state('registerroom', {
      url: '/registerroom',
      templateUrl: '/views/registerroom.html',
       controller: 'RoomCtrl as vm'
    });
    $stateProvider.state('listofrooms', {
      url: '/listofrooms',
      templateUrl: '/views/listofrooms.html',
       controller: 'RoomCtrl as vm'
    });
    $stateProvider.state('rom', {
      url: '/rom/:name &:location',
      templateUrl: '/views/roomdetail.html',
      controller: 'RoomCtrl as vm',
    });

    //Building New Agenda
    $stateProvider.state('roomselection', {
      url: '/roomselection',
      templateUrl: '/views/roomselection.html',
       controller: 'RoomCtrl as vm',
    });
    $stateProvider.state('dateselection', {
      url: '/dateselection/:name &:location',
      templateUrl: '/views/dateselection.html',
       controller: 'AgendaCtrl as vm',
    });

    //Alternative flow for agendamento
    $stateProvider.state('calendarselection', {
      url: '/calendarselection/',
      templateUrl: '/views/calendarselection.html',
       controller: 'AgendaCtrl as vm',
    });
    $stateProvider.state('selectbycalendar', {
      url: '/selectbycalendar/:date',
      templateUrl: '/views/selectbycalendar.html',
       controller: 'AgendaCtrl as vm',
    });

    //Member Control
    $stateProvider.state('registerpeople', {
      url: '/registerpeople',
      templateUrl: '/views/registerpeople.html',
       controller: 'PeopleCtrl as vm'
    });
    $stateProvider.state('listofmembers', {
      url: '/listofmembers',
      templateUrl: '/views/listofmembers.html',
       controller: 'PeopleCtrl as vm'
    });
    $stateProvider.state('membr', {
      url: '/membr/:email',
      templateUrl: '/views/memberdetail.html',
      controller: 'PeopleCtrl as vm',
    });

    $stateProvider.state('logout', {
      url: '/logout',
      controller: 'LogoutCtrl as vm'
    });

    //Agenda Section
    $stateProvider.state('registeragenda', {
      url: '/registeragenda',
      templateUrl: '/views/registeragenda.html',
       controller: 'AgendaCtrl as vm'
    });
    $stateProvider.state('agendatypes', {
      url: '/agendatypes',
      templateUrl: '/views/agendatypes.html',
       controller: 'ConstantsCtrl as vm'
    });
    $stateProvider.state('agendaforuser', {
      url: '/agendaforuser',
      templateUrl: '/views/agendas.html',
       controller: 'AgendaCtrl as vm'
    });
    $stateProvider.state('agendadetails', {
      url: '/agendadetails/:agendaID',
      templateUrl: '/views/agendadetails.html',
       controller: 'AgendaCtrl as vm'
    });
    $stateProvider.state('agendarema', {
      url: '/agendarema/:agendaID',
      templateUrl: '/views/agendarema.html',
       controller: 'AgendaCtrl as vm'
    });

    $stateProvider.state('slaveselection', {
      url: '/slave',
      templateUrl: '/views/slaveselection.html',
       controller: 'SlaveCtrl as vm'
    });
    $stateProvider.state('slavedevice', {
      url: '/slave/:room',
      templateUrl: '/views/slaved.html',
       controller: 'SlaveCtrl as vm'
    });

    $stateProvider.state('acceptpage', {
      url: '/acceptpage/:guest&:agenda',
      templateUrl: '/views/acceptpage.html',
       controller: 'SlaveCtrl as vm'
    });
    
    //Reports
    $stateProvider.state('paymentreport', {
      url: '/paymentreport/',
      templateUrl: '/views/paymentreport.html',
       controller: 'ExtractorCtrl as vm'
    });
    $stateProvider.state('usagereport', {
      url: '/usagereport/',
      templateUrl: '/views/usagereport.html',
       controller: 'ExtractorCtrl as vm'
    });
    $stateProvider.state('remareport', {
      url: '/remareport/',
      templateUrl: '/views/remareport.html',
       controller: 'ExtractorCtrl as vm'
    });
    //EndReports

    $stateProvider.state('remanejamentos', {
      url: '/remanejamentos',
      templateUrl: '/views/remanejamentos.html',
       controller: 'RemanejaCtrl as vm'
    });
    $stateProvider.state('remaneja', {
      url: '/remanejamento/:id',
      templateUrl: '/views/remanejamento.html',
       controller: 'RemanejaCtrl as vm'
    });
    $stateProvider.state('appconfigs', {
      url: '/configs/',
      templateUrl: '/views/appconfigs.html',
       controller: 'ExtractorCtrl as vm'
    });
    
    

    //Teste Section -- Used as a test page where its a pattern to view changes and shits.
    $stateProvider.state('teste', {
      url: '/teste',
      templateUrl: '/views/teste.html',
        controller: 'TesteCtrl as vm'
    });

    //Authentication Section
    $httpProvider.interceptors.push('authInterceptor');
    
  });