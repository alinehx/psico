'use strict';

app.controller('SlaveCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, globalized) {
	var actualHost = globalized;
	var vm = this;
	vm.state = $state;
	vm.urlAgenda = actualHost + '/agenda';
	vm.urlRoom = actualHost + '/class';
	vm.urlGuest = actualHost + '/guest';
	vm.urlHour = actualHost + '/hours';

	vm.roomList = [];
	vm.hourList = [];
	vm.agendaDetails = {};

	vm.actualRoom = null;
	vm.actualDate = null;

	vm.reflectedRoom = {};
	vm.reflectedHour = {};
	vm.reflectedAgenda = {};
	vm.roomState = "";

	vm.isLoading = true;

	vm.loadNecessaryContent = function(){
		var date = new Date();
		vm.actualDate = date;
		vm.getRoomList();
	};

	vm.hasActualRoom = function(item){
		if(item != null && item.length > 0){
			return false;
		}
		return true;
	}

	vm.getRoomList = function(){
		$http.get(vm.urlRoom)
		.success(function (res){
			vm.roomList = res;
		})
		.error(function(err){
			alert('warning',"FAIL");
		});
	};

	vm.startSlavery = function(roomid){
		vm.actualDate = new Date();
		vm.getRoomByID(roomid, vm.actualDate);
	}

	vm.getRoomByID = function(id, date){
		var newurl = vm.urlRoom + "/u/" + id;
		console.log(newurl);
		$http.get(newurl)
		.success(function (res){
			vm.reflectedRoom = res;
			console.log("r",res);
			vm.getHoursForRoomAndDay(id, date);
		})
		.error(function(err){
			alert('warning',"FAILED. Contact the support.");
		});
	};

	vm.canShowAgendaInfo = function(){
		var yes = false;
		console.log(vm.waitForNext, vm.isLoading)
		if(vm.waitForNext == false && vm.isLoading == false){
			yes = true;
		}
		return yes;
	};

	vm.waitForNext = false;
	vm.buildEmptyRoom = function(){
		vm.waitForNext = true;
		vm.roomState="LIVRE";
		var nowdate = new Date();
		var nowH = nowdate.getHours();
		var nowM = nowdate.getMinutes();
		var endTime = "";
		if(nowM < 30){
			endTime = nowH + ":30";
		} else {
			endTime = nowH+1 + ":00";
		}
		console.log('next', endTime);
		vm.setHourCounter(endTime);
	};

	vm.getHoursForRoomAndDay = function(room, date){
		var newurl = vm.urlHour + "/s/" + date + "&" + room;
		console.log(newurl);
		$http.get(newurl)
		.success(function (res){
			if(res.length > 0){
				console.log("hasHourForDay");
				vm.findAgendaForHour(res);
			} else{
				//TODO
				console.log("DONThasHourForDay");
				vm.buildEmptyRoom();
			}
		})
		.error(function(err){
			alert('warning',"FAIL");
		});
	};

	function prepareHour(){
		var date = new Date();
		var actualHour = parseInt(date.getHours());
		var actualMin = date.getMinutes();
		var preparedHour = "";
		if(actualMin >= 30){
			preparedHour = actualHour + ":30";
		} else{
			preparedHour = actualHour + ":00";
		}
		return preparedHour;
	};

	vm.findAgendaForHour = function(hourList){
		var preparedHour = prepareHour();
		var c = 0;
		hourList.forEach(function(h){
			if(c == 0 && h.hour == preparedHour){
				c++;
				if(h.agenda != null){
					console.log("HASAgendaForNOW");
					vm.roomState = "OCUPADA";
					vm.getHoursFromAgenda(h.agenda);
				} else {
					//TODO
					console.log("NOAgendaForNOW");
					vm.roomState = "LIVRE";
					vm.buildEmptyRoom();
				}
			}
		});
	};

	vm.getHoursFromAgenda = function(agenda){
		var newurl = vm.urlHour + "/u/" + agenda;
		$http.get(newurl)
		.success(function (res){
			vm.hourList = res;
			vm.getAgendaDetail(agenda);
		})
		.error(function(err){
			alert('warning',"FAIL");
		});
	};

	vm.getAgendaDetail = function(agendaID){
		var newurl = vm.urlAgenda + "/a/" + agendaID;
		$http.get(newurl)
		.success(function (res){
			vm.reflectedAgenda = res;
			console.log(vm.reflectedAgenda);
			vm.setHourCounter(res.endTime);
		})
		.error(function(err){
			alert('warning',"FAIL");
		});
	};

	//Auxiliar:
	vm.setHourCounter = function(lastHour){
		var hourValue = lastHour.split(':');
		var h = hourValue[0];
		var m = hourValue[1];
		var endTime = new Date();

		endTime.setMilliseconds(0);
		endTime.setSeconds(0);
		endTime.setMinutes(m);
		endTime.setHours(h);

		vm.hourValue = endTime;
		vm.countDown = initializeClock(endTime);
	};

	function configureTime(val){
		var newval = ""+ val;
		if(newval.length < 2){
			newval = "0"+val;
		}
		return newval;
	};

	function initializeClock(endtime){
		var clock = document.getElementById('countdown');
		vm.isLoading = false;
		var timeinterval = setInterval(function(){
			var t = getTimeRemaining(endtime);
			var pHour = configureTime(t.hours);
			var pMin = configureTime(t.minutes);
			var pSec = configureTime(t.seconds);

			clock.innerHTML = 	'' + pHour + ':' + pMin + ':' + pSec;

			if(t.total <= 0){
				clearInterval(timeinterval);
				$state.go('slavedevice',{
					room: vm.state.params.room
				});
			}
		},1000);
	}

	//counter
	function getTimeRemaining(endtime){
		var t = Date.parse(endtime) - Date.parse(new Date());
		var seconds = Math.floor( (t/1000) % 60 );
		var minutes = Math.floor( (t/1000/60) % 60 );
		var hours = Math.floor( (t/(1000*60*60)) % 24 );
		var days = Math.floor( t/(1000*60*60*24) );
		return {
			'total': t,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	}

	vm.gotoSlaveDevice = function(roomName){
		vm.roomList.forEach(function(room){
			if(room.name == roomName){
				$state.go('slavedevice',{
					room: room.id
				});
			}
		});
	}
});