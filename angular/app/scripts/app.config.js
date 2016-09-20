'use strict';
angular
  .module('psico2App').config(function ($urlRouterProvider, $stateProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/login');

    //Main Primary Section
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: '/views/login.html',
       controller: 'LoginCtrl'
    });
    $stateProvider.state('main', {
      url: '/index',
      templateUrl: '/views/index.html',
      controller:"AgendaCtrl as vm"
    });

    //User Control
    $stateProvider.state('registeruser', {
      url: '/registeruser',
      templateUrl: '/views/registeruser.html',
        controller: 'UserCtrl as vm'
    });
    $stateProvider.state('listofusers', {//All Users.
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

    //Member Control
    $stateProvider.state('registerpeople', {
      url: '/registerpeople',
      templateUrl: '/views/registerpeople.html',
        controller: 'PeopleCtrl as vm'
    });
    $stateProvider.state('listofmembers', {//All Members.
      url: '/listofmembers',
      templateUrl: '/views/listofmembers.html',
        controller: 'PeopleCtrl as vm'
    });
    $stateProvider.state('membr', {//Unitary Member Details
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
    $stateProvider.state('agendalist', {
      url: '/agendalist',
      templateUrl: '/views/agendalist.html',
        controller: 'AgendaCtrl as vm'
    });
    $stateProvider.state('agendadetails', {
      url: '/agendadetails/:agendaID',
      templateUrl: '/views/agendadetails.html',
        controller: 'AgendaCtrl as vm'
    });
    $stateProvider.state('slavedevice', {
      url: '/slave/:roomID',
      templateUrl: '/views/slaveagenda.html',
        controller: 'SlaveCtrl as vm'
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