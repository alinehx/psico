'use strict';

app.controller('ExtractorCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, $cookies, globalized) {
	var actualHost = globalized;
	var vm = this;
	vm.state = $state;
	vm.urlAgenda = actualHost + '/agenda';
	vm.urlRemaneja = actualHost + '/remaneja';
	vm.urlUser = actualHost + '/user';
	vm.urlRoom = actualHost + '/class'; // /u/:room
	vm.urlHours = actualHost + '/hours'; // /u/:agenda

	//Attribute
	vm.halfHourPrice = 5 //$globalized ('priceForHalfAnHour'); // in reais $
	vm.textReport = "";
	vm.agendasForUser = {};
	vm.userList = [];
	vm.byUser = null;
	vm.agendaList = [];
	vm.isPrinting = false;
	vm.hourForUser = 0;


	//SEND MAIL
	vm.selectedEmail = document.getElementById('inputEmail');
	vm.urlContants = actualHost + '/constants';
	vm.sendReportByMail = function(mailName){
		if(vm.selectedEmail == undefined || vm.selectedEmail == null || vm.selectedEmail == '' ){
			alert('warning', 'Error! Favor preencher o campo de email.');
		} else {
			var obj = {
				name: mailName,
				email: vm.selectedEmail,
				report: vm.textReport
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


	vm.processData = function(unique, responsable, hourSize, halfHourPrice){
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
		vm.userList.forEach(function(userInList){
			if(userInList.name == user){
				newUser = userInList.email;
			}
		});

		var newurl = vm.urlAgenda + '/extract/' + newUser + "&" + initDate + "&" + endDate;
		$http.get(newurl)
		.success(function (res){
			if(res.length < 1){
				vm.printNoneAction(user);
			}
			vm.executeHourExtraction(unique, user, res);
		})
		.error(function(err){
			vm.isPrinting = false;
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};
	

	vm.executeHourExtraction = function(unique, responsable, agendaList){
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
						console.log('H: ' + res.length + ", P: " + r.price);
					}
				});

				if(ctrl==size){
					vm.processData(unique, responsable, hrs, price);
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
			vm.printInReport(" UTILIZADA PARA [" + res.typeClass + "]\n");
			vm.printInReport(" \n");
			vm.printInReport(" DE " + vm.init.day + ' / ' + vm.init.month + ' / ' + vm.init.year  + " \n");
			vm.printInReport(" ATÉ " + vm.end.day + ' / ' + vm.end.month + ' / ' + vm.end.year  + " \n");
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
			vm.printAgendaDetails();
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};

	vm.printAgendaDetails = function(){
		vm.printInReport("## A SALA TEVE [" + vm.agendaList.length + "] AGENDAMENTOS \n");

		vm.agendaList.forEach(function(agenda){
			vm.printInReport(" \n");
			vm.printInReport(" AGENDAMENTO " + agenda.id + " \n");
			vm.printInReport(" RESPONSAVEL " + agenda.responsable + " \n");
			vm.printInReport(" DIA " + vm.formatDateToDisplay(agenda.date) + " \n");
			vm.printInReport(" DAS " + agenda.initTime + "h ATÉ AS " + agenda.endTime + "h \n");
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
		console.log('a');
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
		console.log('b');
		var newurl = vm.urlRemaneja + '/extract/' + initDate + "&" + endDate;
		$http.get(newurl)
		.success(function (res){
			console.log('c', res);
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
		console.log("rema", remaList);
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
		
		remaList.forEach(function(rema){
			vm.printInReport(" SOLICITANTE REMANEJAMENTO " + rema.target + " \n");
			vm.printInReport(" AGENDA DE " + rema.owner + " \n");
			vm.printInReport(" AGENDAMENTO ORIGINAL " + rema.agenda + " \n");

			if(rema.status){
				vm.printInReport(" STATUS RESPOSTA [RESPONDIDO] \n");
			}else{
				vm.printInReport(" STATUS RESPOSTA [PENDENTE] \n");
			}
			vm.printInReport(" \n");
			vm.printInReport(" FIM DO RELATÓRIO  \n");
			vm.printInReport(" \n");
		});
		vm.showModal();
	};

	vm.printNoneRemaneja = function(){
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