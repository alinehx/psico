'use strict';


app.controller('HeaderCtrl', function ($scope, authToken, $cookies) {
	$scope.isAuthenticated = authToken.isAuthenticated;
	$scope.loggedUserName = $cookies.get('loggedUserName');
});
