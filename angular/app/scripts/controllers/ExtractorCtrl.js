'use strict';

app.controller('ExtractorCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, $cookies, globalized) {
	var actualHost = globalized;
	var vm = this;

	//DefaultSettings
	$(document).ready(function(){
		$('#mainHeader').show();
		$('mainFooter').show();
		$("body").removeClass('not-occupied');
		$("body").removeClass('occupied');
	});

	vm.state = $state;
	vm.urlAgenda = actualHost + '/agenda';
	vm.urlRemaneja = actualHost + '/remaneja';
	vm.urlUser = actualHost + '/user';
	vm.urlRoom = actualHost + '/class'; // /u/:room
	vm.urlHours = actualHost + '/hours'; // /u/:agenda

	//Attribute
	vm.halfHourPrice = 5 //$globalized ('priceForHalfAnHour'); // in reais $
	vm.textReport = "";
	vm.csvReport = "";
	vm.agendasForUser = {};
	vm.userList = [];
	vm.byUser = null;
	vm.agendaList = [];
	vm.isPrinting = false;
	vm.hourForUser = 0;


	//SEND MAIL
	vm.urlContants = actualHost + '/constants';
	vm.sendReportByMail = function(mailName){
		if(vm.mailModel == undefined || vm.mailModel == null || vm.mailModel == '' ){
			alert('warning', 'Error! Favor preencher o campo de email.');
		} else {
			
			var obj = {
				name: mailName,
				email: vm.mailModel,
				report: vm.csvReport
			};
			var newurl = vm.urlContants + "/sendreport";
			$http.post(newurl, obj)
			.success(function (res){
				alert('success',"E-mail contendo as informações do report foi enviado.");
			})
			.error(function(err){
				alert('warning',"Error! Não foi possivel executar a requisição.");
			});
		}
	};

	vm.mailModel = null;
	vm.isMailMissing = function(){
		if(vm.mailModel == null || vm.mailModel == '' ){
			return false;
		} else{
			if(vm.isDataSet(vm.byUser) || vm.isDataSet(vm.isTotal)){
				if(vm.textReport.length > 0){
					return true;
				}
				return false;
			}
			return false;
		}
	};

	vm.setPageInfo = function(){
		vm.getAllUsers();
		vm.getRoomList();
	};

	vm.getAllUsers = function(){
		$http.get(vm.urlUser)
		.success(function (res){
			vm.userList = res;
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};

	vm.initPaymentReport = function(user){
		vm.clearPrintFile();
		vm.hourForUser = 0;
		var initDate = vm.init.month + '-' + vm.init.day + '-' + vm.init.year;
		var endDate = vm.end.month + '-' + vm.end.day + '-' + vm.end.year;

		// IS TOTAL? SE SIM -> TOTAL FLOW, SE N -> Normal FLOW.
		vm.printInReport("###################################### \n");
		vm.printInReport("## RELATORIO DE COBRANÇA \n");
		vm.printInReport("## DE ~ " + vm.init.day + ' / ' + vm.init.month + ' / ' + vm.init.year  + " \n");
		vm.printInReport("## ATÉ ~ " + vm.end.day + ' / ' + vm.end.month + ' / ' + vm.end.year  + " \n");
		vm.printInReport("## \n");
		vm.printInReport("###################################### \n");
		vm.csvReport = "usuario;email;horas utilizadas;total a pagar;\n";

		if(user == null){
			vm.extractForAll(initDate, endDate);
		} else {
			vm.extractAgendasForMonth(true, user, initDate, endDate);
		}
	};

	vm.extractForAll = function (initDate, endDate){
		var count = 0;
		vm.userList.forEach(function(user){
			vm.extractAgendasForMonth(false, user.name, initDate, endDate);
		});
		
		vm.showModal();
	};


	vm.processData = function(unique, responsable, responsableName, hourSize, halfHourPrice){
		if(unique){
			vm.printInReport(" USUÁRIO " + responsable + "\n");
			vm.printInReport(" HORAS UTILIZADAS [" + hourSize + "]\n");
			vm.printInReport(" VALOR À SER COBRADO R$" + halfHourPrice + ",00\n");
			vm.printInReport(" \n");
			vm.printInReport(" FIM DO RELATORIO DE USO DE SALAS  \n");
			vm.printInReport(" \n");
			vm.showModal();
		} else {
			vm.printInReport(" USUÁRIO " + responsable + "\n");
			vm.printInReport(" HORAS UTILIZADAS [" + hourSize + "]\n");
			vm.printInReport(" VALOR À SER COBRADO R$" + halfHourPrice + ",00\n");
			vm.printInReport(" \n");
		}
		vm.csvReport = vm.csvReport + responsableName + ";" + responsable + ";" + hourSize + ";" + "R$" + halfHourPrice + ",00;\n";
	};

	vm.printInReport = function(text){
		vm.textReport = vm.textReport.concat(text);
	};

	vm.clearPrintFile = function(){
		vm.textReport = "";
	};

	vm.showModal = function(){
		$('#myModal').modal('show'); 
	};

	
	vm.extractAgendasForMonth = function (unique, user, initDate, endDate){
		var newUser = "";
		var name = "";
		vm.userList.forEach(function(userInList){
			if(userInList.name == user){
				newUser = userInList.email;
				name = userInList.name;
			}
		});

		var newurl = vm.urlAgenda + '/extract/' + newUser + "&" + initDate + "&" + endDate;
		$http.get(newurl)
		.success(function (res){
			if(res.length < 1){
				vm.printNoneAction(user);
				vm.csvReport = vm.csvReport + name + ";" + newUser + ";nao possui agendamentos para o periodo informado;" + "R$ 0,00;\n";
			}
			vm.executeHourExtraction(unique, user, name, res);
		})
		.error(function(err){
			vm.isPrinting = false;
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};
	

	vm.executeHourExtraction = function(unique, responsable, responsableName, agendaList){
		var roomListForUser = [];
		var size = agendaList.length;
		var ctrl = 0;
		var hrs = 0;
		var price = 0;

		if(agendaList.length < 1){
			vm.isPrinting = false;
		}

		agendaList.forEach(function(agenda){
			var newurl = vm.urlHours + '/u/' + agenda.id;

			$http.get(newurl)
			.success(function (res){
				// vm.hourForUser = vm.hourForUser + res.length;

				hrs = hrs + res.length;
				ctrl++;

				vm.roomList.forEach(function(r){
					if(r.id == agenda.roomID){
						price = price + (res.length * r.price);
					}
				});

				if(ctrl==size){
					vm.processData(unique, responsable, responsableName, (hrs/2), price);
				}
			})
			.error(function(err){
				vm.isPrinting = false;
				alert('warning',"Error! Não foi possivel executar a requisição.");
			});
		});
	};

	vm.printNoneAction = function(user){

		var finalPrice = 0;
		vm.printInReport(" USUÁRIO " + user + "\n");
		vm.printInReport(" NÃO POSSUÍ AGENDAMENTOS NO PERIODO \n");
		vm.printInReport(" [SEM COBRANÇA] \n");
		vm.printInReport(" \n");

		vm.showModal();
	};

	//EXTRACT BY ROOM:
	vm.roomList = [];
	vm.byRoom = null;
	vm.init = {
		day: null,
		month: null,
		year: null
	}
	vm.end = {
		day: null,
		month: null,
		year: null
	}

	vm.dayList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	vm.monthList = [1,2,3,4,5,6,7,8,9,10,11,12];
	vm.yearList = [2016,2017,2018];

	vm.initUsageReport = function(){
		vm.clearPrintFile();
		vm.textReport = "";
		vm.getRoomList();
	};

	vm.prepareDataToExtractByRoom = function(){
		vm.clearPrintFile();
		//LIMPAR VARIAVEIS ANTES DE EXECUTAR
		var room = vm.byRoom;
		var initDate = vm.init.month + '-' + vm.init.day + '-' + vm.init.year;
		var endDate = vm.end.month + '-' + vm.end.day + '-' + vm.end.year;

		vm.printInReport(" \n");
		vm.searchRoom(vm.byRoom, initDate, endDate);
	};

	vm.searchRoom = function(room, initDate, endDate){
		
		vm.roomList.forEach(function(room){
			if(room.name == vm.byRoom){
				vm.printRoomDetail(room, initDate, endDate);
			}
		});
	};

	vm.getRoomList = function (){
		var newurl = vm.urlRoom;
		$http.get(newurl)
		.success(function (res){
			vm.roomList = res;
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};

	vm.printRoomDetail = function (room, initDate, endDate){
		var newurl = vm.urlRoom + '/u/' + room.id;
		$http.get(newurl)
		.success(function (res){
			vm.printInReport(" SALA [" + res.name + "] - [" + res.location + "]\n");
			vm.printInReport(" \n");
			vm.printInReport(" DE " + vm.init.day + ' / ' + vm.init.month + ' / ' + vm.init.year  + " \n");
			vm.printInReport(" ATÉ " + vm.end.day + ' / ' + vm.end.month + ' / ' + vm.end.year  + " \n");

			vm.csvReport = "Sala: " + res.name + ";Localizacao: " + res.location + ";";
			vm.extractAgendaByRoom(res.id, initDate, endDate);
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};

	vm.extractAgendaByRoom = function (roomID, initDate, endDate){
		var newurl = vm.urlAgenda + '/extractroom/' + roomID + "&" + initDate + "&" + endDate;
		$http.get(newurl)
		.success(function (res){
			vm.agendaList = res;
			vm.printAgendaDetails(initDate, endDate);
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};

	vm.printAgendaDetails = function(initDate, endDate){
		vm.printInReport("## A SALA TEVE [" + vm.agendaList.length + "] AGENDAMENTOS \n");
		vm.csvReport = vm.csvReport + "Total de agendamentos: " + vm.agendaList.length + ";Inicio da extracao: " + initDate + ";Final da extracao: " + endDate +";\n;\n";
		vm.csvReport = vm.csvReport + "id agendamento;dia agendamento;reponsavel pelo agendamento;hora de inicio; hora de fim;\n";

		vm.agendaList.forEach(function(agenda){
			var dt = vm.formatDateToDisplay(agenda.date);
			vm.printInReport(" \n");
			vm.printInReport(" AGENDAMENTO " + agenda.id + " \n");
			vm.printInReport(" RESPONSAVEL " + agenda.responsable + " \n");
			vm.printInReport(" DIA " + dt + " \n");
			vm.printInReport(" DAS " + agenda.initTime + "h ATÉ AS " + agenda.endTime + "h \n");

			vm.csvReport = vm.csvReport + agenda.id + ";" + dt + ";" + agenda.responsable + ";" + agenda.initTime + "h;" + agenda.endTime + "h;\n";
		});
		vm.printInReport(" \n");
		vm.printInReport(" FIM DA EXTRAÇÃO \n");
		vm.printInReport(" \n");
		$('#myModal').modal('show'); 
	};

	vm.formatDateToDisplay = function(date){
		var newDate = new Date(date);
		var day = newDate.getDate();
		var mon = newDate.getMonth() + 1;
		var year = newDate.getFullYear();
		return day + "/" + mon + "/" + year;
	};

	vm.gotoReports = function(){
		$state.go('paymentreport');
	};
	
	vm.gotoUsages = function(){
		$state.go('usagereport');
	};

	vm.gotoRemanejas = function(){
		$state.go('remareport');
	};

	vm.gotoSlave = function(){
		$state.go('slaveselection');
	}

	vm.gotoConstants = function(){
		$state.go('constants');
	}

	//REMANEJA REPORT
	vm.initRemanejaReport = function(){
		vm.clearPrintFile();
		var initDate = vm.init.month + '-' + vm.init.day + '-' + vm.init.year;
		var endDate = vm.end.month + '-' + vm.end.day + '-' + vm.end.year;

		vm.printInReport(" \n");
		vm.printInReport(" RELATORIO DE REMANEJAMENTOS \n");
		vm.printInReport(" DE ~ " + vm.init.day + ' / ' + vm.init.month + ' / ' + vm.init.year  + " \n");
		vm.printInReport(" ATÉ ~ " + vm.end.day + ' / ' + vm.end.month + ' / ' + vm.end.year  + " \n");
		vm.printInReport(" \n");
		vm.printInReport(" \n");

		vm.getAllRemanejas(initDate, endDate);
	};

	vm.getAllRemanejas = function(initDate, endDate){
		var newurl = vm.urlRemaneja + '/extract/' + initDate + "&" + endDate;
		$http.get(newurl)
		.success(function (res){

			vm.csvReport = "Total de remanejamentos: " + res.length + ";Inicio da extracao: " + initDate + ";Final da extracao: " + endDate +";\n;\n";
			if(res.length > 0){
				vm.printRemanejas(res);
			} else {
				vm.printNoneRemaneja();
			}
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	}

	vm.printRemanejas = function(remaList){
		var accepted = 0;
		var rejected = 0;
		var pending = 0;
		var total = remaList.length;
		
		remaList.forEach(function(rema){
			
			if(rema.resp == "A"){
				accepted++;
			}
			if(rema.resp == "R"){
				rejected++;
			}
			if(rema.status == false){
				pending++;
			}
		});
		
		vm.printInReport(" \n");
		vm.printInReport(" TOTAL DE REMANEJAMENTOS [" + total + "] \n");
		vm.printInReport(" \n");
		vm.printInReport(" ACEITADOS [" + accepted + "] \n");
		vm.printInReport(" REJEITADOS [" + rejected + "] \n");
		vm.printInReport(" PENDENTE RESPOSTA [" + pending + "] \n");
		vm.printInReport(" \n");
		vm.printInReport(" \n");
		vm.printInReport(" DETALHE DOS REMANAJEMANTOS \n");
		vm.printInReport(" \n");
		
		vm.csvReport = 	vm.csvReport + "Total De Remanejamentos;"+ total +";\nTotal de aceitados;" + accepted + ";\nTotal de Rejeitados; " 
						+ rejected +";\nTotal pendente resposta;" + pending + ";\n;\n";

		vm.csvReport = 	vm.csvReport + "ID Agendamento; Solicitante; Reponsavel; Foi respondido?; Resposta;\n";
		remaList.forEach(function(rema){
			vm.printInReport(" SOLICITANTE REMANEJAMENTO " + rema.target + " \n");
			vm.printInReport(" AGENDA DE " + rema.owner + " \n");
			vm.printInReport(" AGENDAMENTO ORIGINAL " + rema.agenda + " \n");

			vm.csvReport = 	vm.csvReport + rema.agenda + ";" + rema.target + ";" + rema.owner + ";";

			if(rema.status){
				vm.printInReport(" STATUS RESPOSTA [RESPONDIDO] \n");
				if(rema.resp == "A"){
					vm.csvReport = 	vm.csvReport + "SIM; Aceitado;\n";
				}
				if(rema.resp == "R"){
					vm.csvReport = 	vm.csvReport + "SIM; Recusado;\n";
				}

			}else{
				vm.printInReport(" STATUS RESPOSTA [PENDENTE] \n");
				vm.csvReport = 	vm.csvReport + "NAO; Pendente;\n";
			}

		});
		vm.showModal();
	};

	vm.printNoneRemaneja = function(){

		vm.csvReport += "Nao houveram remanejamentos no periodo informado.";
		vm.printInReport(" SEM SOLICITAÇÕES PARA O PERIODO  \n");
		vm.printInReport(" \n");
		vm.printInReport(" FIM DO RELATÓRIO  \n");
		vm.printInReport(" \n");
		vm.showModal();
	};

	//Check
	vm.isTotal = "ok";
	vm.isDataSet = function(item){
		if(item == null || item.length <= 0){
			return false;
		}
		if(vm.init.day == null || vm.init.day.length <= 0){
			return false;
		}
		if(vm.init.month == null || vm.init.month.length <= 0){
			return false;
		}
		if(vm.init.year == null || vm.init.year.length <= 0){
			return false;
		}
		if(vm.end.day == null || vm.end.day.length <= 0){
			return false;
		}
		if(vm.end.month == null || vm.end.month.length <= 0){
			return false;
		}
		if(vm.end.year == null || vm.end.year.length <= 0){
			return false;
		}
		return true;
	};
});