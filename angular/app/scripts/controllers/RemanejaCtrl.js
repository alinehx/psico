'use strict';

app.controller('RemanejaCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, $cookies) {
	var vm = this;
	vm.state = $state;
	vm.urlAgenda = 'http://localhost:1337/agenda';
	vm.urlGuest = 'http://localhost:1337/guest';
	vm.urlRemaneja = 'http://localhost:1337/remaneja';

	vm.setMine = false;
	vm.byTarget = {};
	vm.byOwner = {};
	vm.remanejaList = {};

	vm.remaneja = {
		agenda: null,
		target: null,
		owner: null,
		resp: null,
		status: null,
	}


	//AJAX
	vm.createOne = function (remaneja) {
		$http.post(vm.urlRemaneja, remaneja)
		.success(function (res) {
			vm.populateGuests(vm.guestList ,res.agenda.id);
			vm.openAgendaDetails(res.agenda.id);
		})
		.error(function (err) {
			if(err.message === 'Autenticação falhou') {
				alert('warning', 'Erro!', 'Usuário não autenticado.');
			} else {
				alert('warning', 'Erro!', 'Não foi possivel executar a requisição. ' + err);
			}
		});
	};

	vm.updateAgenda = function(remaneja){
		var preparedUrl = vm.urlAgenda + "/" + agenda.id;
		var newRemaneja = {
			resp: vm.remaneja.resp,
			status: vm.remaneja.status
		};

		$http.put(preparedUrl, newGuestStatus)
		.success(function(res){
			alert('success','Sucesso!', 'Requisição realizada com sucesso.');
		})
		.error(function(err){
			alert('warning',"Error!", "Não foi possivel executar a requisição." + err);
		});
	}

	vm.getAll = function (){
		var newurl = vm.urlRemaneja;
		$http.get(newurl)
		.success(function (res){
			alert('success',"Requisição realizada com sucesso.");
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};
	
	vm.getByTarget = function (user){
		var newurl = vm.urlRemaneja;
		$http.get(newurl)
		.success(function (res){
			alert('success',"Requisição realizada com sucesso.");
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};

	vm.getByOwner = function (){
		var newurl = vm.urlRemaneja;
		$http.get(newurl)
		.success(function (res){
			alert('success',"Requisição realizada com sucesso.");
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};

	vm.getByAgenda = function (){
		var newurl = vm.urlRemaneja;
		$http.get(newurl)
		.success(function (res){

			alert('success',"Requisição realizada com sucesso.");
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};
	
	vm.getOne = function (remaneja){
		var newurl = vm.urlRemaneja;
		$http.get(newurl)
		.success(function (res){
			alert('success',"Requisição realizada com sucesso.");
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};


});