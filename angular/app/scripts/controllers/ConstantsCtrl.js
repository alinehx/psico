'use strict';

app.controller('ConstantsCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, $cookies, globalized) {
	var actualHost = globalized;
	var vm = this;
	vm.state = $state;
	vm.urlAgenda = actualHost + '/agenda'; 
	vm.urlHours = actualHost + '/hours';

	vm.gotoAgendaList = function(){
		$state.go('agendaforuser');
	};

	vm.gotoAgendaTypes = function(){
		$state.go('agendatypes');
	};

	vm.gotoRemanejaList = function(){
		$state.go('remanejamentos');
	};

	vm.gotoRegisterByRoom = function(){
		$state.go('roomselection');
	};
	
	vm.gotoRegisterByHour = function(){
		$state.go('calendarselection');
	};

});