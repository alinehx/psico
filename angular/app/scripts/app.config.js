'use strict';
angular
  .module('psico2App').config(function ($urlRouterProvider, $stateProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('login', {
      url: '/',
      templateUrl: '/views/login.html',
       controller: 'LoginCtrl'
    });

    $stateProvider.state('main', {
      url: '/index',
      templateUrl: '/views/index.html'
    });

    $stateProvider.state('register', {
      url: '/register',
      templateUrl: '/views/register.html',
        controller: 'RegisterCtrl'
    });

   
    $stateProvider.state('logout', {
      url: '/logout',
      controller: 'LogoutCtrl'
    });


    $httpProvider.interceptors.push('authInterceptor');
    
  });