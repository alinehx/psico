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

	vm.loadNecessaryContent = function(){
		var date = new Date();
		vm.actualDate = date;
		vm.getRoomList();
	};

	vm.hasActualRoom = function(item){
		console.log(item);
		if(item != null && item.length > 0){
			return false;
		}
		return true;
	}

	vm.getRoomList = function(){
		console.log('log');
		$http.get(vm.urlRoom)
		.success(function (res){
			console.log('res', res)
			vm.roomList = res;
		})
		.error(function(err){
			alert('warning',"FAIL");
		});
	};

	vm.startSlavery = function(roomid){
		vm.actualDate = new Date();
		console.log("state",vm.state);
		vm.getRoomByID(roomid, vm.actualDate);
	}

	vm.getRoomByID = function(id, date){
		var newurl = vm.urlRoom + "/" + id;
		$http.get(vm.urlRoom)
		.success(function (res){
			vm.reflectedRoom = res;
			vm.getHoursForRoomAndDay(id, date);
		})
		.error(function(err){
			alert('warning',"FAILED. Contact the support.");
		});
	};

	vm.getHoursForRoomAndDay = function(room, date){
		var newurl = vm.urlHour + "/" + date + "&" + room;
		console.log(newurl);
		$http.get(newurl)
		.success(function (res){
			console.log('hours4day', res);
			if(res.length > 0){
				vm.findAgendaForHour(res);
				console.log("FOUND", res);
			} else{
				//Dont Have Any Shit
			}
		})
		.error(function(err){
			alert('warning',"FAIL");
		});
	};

	vm.findAgendaForHour = function(hourList){
		var date = new Date();
		var actualHour = parseInt(date.getHours());
		var actualMin = date.getMinutes();
		var preparedHour = "";
		if(actualMin >= 30){
			preparedHour = actualHour + ":30";
		} else{
			preparedHour = actualHour + ":00";
		}
		var c = 0;
		hourList.forEach(function(h){
			if(c == 0 && h.hour == preparedHour){
				c++;
				vm.getHoursFromAgenda(h.agenda);
				console.log("FOUND", h.agenda);
			}
		});
	};

	vm.getHoursFromAgenda = function(agenda){
		var newurl = vm.urlHour + "/u/" + agenda;
		$http.get(newurl)
		.success(function (res){
			vm.hourList = res;
			vm.calculateHourRage();
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
			vm.agendaDetails = res;
		})
		.error(function(err){
			alert('warning',"FAIL");
		});
	};

	//Auxiliar:
	vm.calculateHourRage = function(){
		var highest = vm.hourList;
		var lowest = vm.hourList;
		var size = vm.hourList.length;
		var counter = 0;

		vm.hourList.forEach(function(hour){
			if(hour.num > highest.num){
				highest = hour;
			}
			if(hour.num < lowest.num){
				lowest = hour;
			}

			if(counter == size){
				vm.setHourCounter(highest);
			}
			counter++;
		});
	};

	vm.setHourCounter = function(lastHour){
		var hourValue = lastHour.hour.split(':');
		var h = hourValue[0];
		var m = hourValue[1];
		var endTime = new Date();

		endTime.setMilliseconds(0);
		endTime.setSeconds(0);
		endTime.setMinutes(m);
		endTime.setHours(h);

		vm.hourValue = endTime;
		//Use the 'endTime' to pass for the 'getTimeRemaining()' and use a ng-model to reflect the timer.
		//Or Start a timer in this method to set the model
	};

	vm.gotoSlaveDevice = function(roomName){
		vm.roomList.forEach(function(room){
			if(room.name == roomName){
				$state.go('slavedevice',{
					room: room.id
				});
			}
		});
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
});