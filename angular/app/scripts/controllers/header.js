'use strict';


app.controller('HeaderCtrl', function ($scope, authToken) {
	$scope.isAuthenticated = authToken.isAuthenticated;
});
