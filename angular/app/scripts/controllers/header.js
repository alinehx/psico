'use strict';


app.controller('HeaderCtrl', function ($scope, authToken, $cookies) {
	$scope.isAuthenticated = authToken.isAuthenticated;

	//Displays the name of the user in the header.
	$scope.getLoggedUserName = function(){
		var loggedName = " | " + $cookies.get('loggedUserName');
		if($cookies.get('loggedUserName') != undefined)
			return loggedName;
	}

	$scope.isAllowed = function(){
		if($scope.isAuthenticated){
			return $cookies.get('isMaster');
		}
	}
});