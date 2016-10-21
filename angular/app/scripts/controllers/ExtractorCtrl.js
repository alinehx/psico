'use strict';

app.controller('ExtractorCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, $cookies) {
	var vm = this;
	vm.state = $state;
	vm.urlAgenda = 'http://localhost:1337/agenda';
	vm.urlUser = 'http://localhost:1337/user';
	vm.urlHours = 'http://localhost:1337/hours'; // /u/:agenda

	//Attribute
	vm.halfHourPrice = 5 //$cookies.get('priceForHalfAnHour'); // in reais $
	vm.textReport = "";
	vm.agendasForUser = {};
	vm.hourForUser = 0;

	vm.initPaymentReport = function(){
		vm.textReport = "";
		var user = 'marcel@gmail.com'; // TESTAR COM LISTA DEPOIS
		var month = 10;
		var year = 2016;

		vm.printInReport("## EXTRAÇÃO DE RELATÓRIO DE COBRANÇA DE HORAS PARA A DATA ["+ month + "/" + year +"] ## \n");
		vm.printInReport("VALOR DE COBRANÇA POR HORA -> R$" + vm.halfHourPrice + ",00\n");

		vm.extractAgendasForMonth(user, month, year);
	};

	vm.processData = function(responsable, hourSize){
		var finalPrice = hourSize * vm.halfHourPrice;
		vm.printInReport("USUÁRIO -> " + responsable + "\n");
		vm.printInReport("HORAS AGENDADAS UTILIZADAS -> " + vm.hourForUser + "\n");
		vm.printInReport("VALOR À SER COBRADO -> R$" + finalPrice + ",00\n");
		vm.printInReport("## FIM DA EXTRAÇÃO ##");
		
		$('#myModal').modal('show'); 
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

	vm.executeHourExtraction = function(responsable, agendaList){
		var size = agendaList.length;
		var ctrl = 0;
		agendaList.forEach(function(agenda){
			var newurl = vm.urlHours + '/u/' + agenda.id;

			$http.get(newurl)
			.success(function (res){
				vm.hourForUser = vm.hourForUser + res.length;
				ctrl++;
				if(ctrl==size){
					vm.processData(agenda.responsable, vm.hourForUser);
				}
			})
			.error(function(err){
				alert('warning',"Error! Não foi possivel executar a requisição.");
			});

		});
	};

	vm.gotoReports = function(){
		$state.go('paymentreport');
	};

});