'use strict';


angular.module('psico2App')
  .factory('authInterceptor', function (authToken) {
    return {
      request: function (config) {
        var token = authToken.getToken();

        if(token) {
          config.headers.Authorization = token;
        }

        return config;
      },
      response: function (response) {
        return response;
      } 
    };
  });
