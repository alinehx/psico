'use strict';
angular
  .module('psico2App').config(function ($urlRouterProvider, $stateProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/login');

    $stateProvider.state('login', {
      url: '/login',
      templateUrl: '/views/login.html',
       controller: 'LoginCtrl'
    });

    $stateProvider.state('main', {
      url: '/index',
      templateUrl: '/views/index.html'
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
    $stateProvider.state('usr', {//Unitary User Details
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
    $stateProvider.state('listofrooms', {//All Rooms.
      url: '/listofrooms',
      templateUrl: '/views/listofrooms.html',
        controller: 'RoomCtrl as vm'
    });
    $stateProvider.state('rom', {//Unitary Room Details
      url: '/rom/:name &:location',
      templateUrl: '/views/roomdetail.html',
      controller: 'RoomCtrl as vm',
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

    $stateProvider.state('teste', {
      url: '/teste',
      templateUrl: '/views/teste.html',
        controller: 'TesteCtrl as vm'
    });


    $httpProvider.interceptors.push('authInterceptor');
    
  });