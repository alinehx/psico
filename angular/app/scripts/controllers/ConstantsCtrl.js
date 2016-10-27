'use strict';

app.controller('ConstantsCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, $cookies, globalized) {
	var actualHost = globalized;
	var vm = this;
	vm.state = $state;
	vm.urlAgenda = actualHost + '/agenda'; 
	vm.urlHours = actualHost + '/hours'; // /u/:agenda

	//Attribute
	vm.halfHourPrice = 5 //$cookies.get('priceForHalfAnHour'); // in reais $
	vm.textReport = "";
	vm.agendasForUser = {};
	vm.hourForUser = 0;

	vm.initPaymentReport = function(){
		vm.printInReport("## EXTRAÇÃO DE RELATÓRIO DE COBRANÇA DE HORAS PARA A DATA ["+ month + "/" + year +"] ## \n");
		vm.printInReport("VALOR DE COBRANÇA POR HORA -> R$" + vm.halfHourPrice + ",00\n");
		var user = null; // TESTAR COM LISTA DEPOIS
		var month = null;
		var year = null;

		vm.extractAgendasForMonth(user, month, year);
	};

	vm.executeHourExtraction = function(responsable, agendaList){
		agendaList.ForEach(function(agenda){
			vm.extractHoursByAgenda(agenda.id);
		});
		vm.processData(responsable, vm.hourForAgenda.size);
	};

	vm.processData = function(responsable, hourSize){
		var finalPrice = hourSize * vm.halfHourPrice;
		vm.printInReport("USUÁRIO -> " + responsable + "\n");
		vm.printInReport("HORAS AGENDADAS UTILIZADAS -> " + vm.hourForUser + "\n");
		vm.printInReport("VALOR À SER COBRADO -> R$" + finalPrice + ",00\n");
		vm.printInReport("## FIM DA EXTRAÇÃO ##");
		
		console.log(vm.textReport);
	};

	vm.printInReport = function(text){
		vm.textReport = vm.textReport.concat(text);
	};

	//CORRIGIR
	vm.extractAgendasForMonth = function (user, month, year){
		var newurl = vm.urlAgenda + '/extract/' + user + "&" + month + "&" + year;
		$http.get(newurl)
		.success(function (res){
			vm.executeHourExtraction(user, res);
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};

	vm.extractHoursByAgenda = function (agendaID){
		var newurl = vm.urlHours + '/u/' + agendaID
		$http.get(newurl)
		.success(function (res){
			vm.hourForUser += res.length;
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};

});