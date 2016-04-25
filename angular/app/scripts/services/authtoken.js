'use strict';
angular.module('psico2App')
  .factory('authToken', function($window) {
    var storage = $window.localStorage;
    var cachedToken;
    var userToken = 'userToken';

    function setToken(token) {
      cachedToken = token;
      storage.setItem(userToken, token);
    }

    function isAuthenticated() {
      return !!getToken();
    }

    function getToken() {
      if (!cachedToken) {
        cachedToken = storage.getItem(userToken);
      }
      return cachedToken;
    }

    function removeToken() {
      cachedToken = null;
      storage.removeItem(userToken);
    }
    var authToken = {
      setToken: setToken,
      isAuthenticated: isAuthenticated,
      getToken: getToken,
      removeToken: removeToken
    };

    return authToken;
  });