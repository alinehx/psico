'use strict';

app.controller('SlaveCtrl', function ($scope, $rootScope, $http, alert, authToken, $state) {
	var vm = this;
	vm.state = $state;
	vm.urlAgenda = 'http://localhost:1337/agenda';
	vm.urlGuest = 'http://localhost:1337/guest';

	vm.guestObject = {};
	vm.agendaDetails = {};

	vm.getGuestFromAgenda = function(){
		var newurl = vm.urlGuest + "/g/" + vm.state.params.agenda + "&" + vm.state.params.guest;
		$http.get(newurl)
		.success(function (res){
			vm.guestObject = res;
			console.log("res", res);
			vm.loadAgendaInfo(vm.guestObject.agenda);
		})
		.error(function(err){
			alert('warning',"Não foi possivel recuperar os dados do convidado. \n Favor tentar novamente mais tarde.");
		});
	}

	vm.updateGuestAcceptFlag = function(){
		var isAccepted = !vm.guestObject.accepted;
		var newurl = vm.urlGuest + "/" + vm.guestObject.agenda + "&" + vm.guestObject.guest;
		vm.newGuest = {
			accepted: isAccepted
		};
		$http.put(newurl, vm.newGuest)
		.success(function (res){
			$state.go('agendadetails', { 
				agendaID: vm.guestObject.agenda
			});
			alert('success', "O convite foi respondido.");
		})
		.error(function(err){
			alert('warning', "Não foi possivel responder o convite o agendamento");
		});
	}

	vm.loadAgendaInfo = function(id){
		var newurl = vm.urlAgenda + "/a/" + id;
		$http.get(newurl)
		.success(function (res){
			vm.agendaDetails = res;
			
			console.log("res2", res);
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição. " + err);
		});
	}

	vm.setPageInfo = function(guest){
		vm.getGuestFromAgenda();
	}

});