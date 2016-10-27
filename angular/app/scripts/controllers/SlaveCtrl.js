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

	vm.actualDate = null;

	vm.loadNecessaryContent = function(){
		vm.actualDate = date;
		vm.getRoomList();
	};

	vm.getRoomList = function(){
		$http.get(vm.urlRoom)
		.success(function (res){
			vn.roomList = res;
		})
		.error(function(err){
			alert('warning',"FAIL");
		});
	};

	vm.getHoursForRoomAndDay = function(room, date){
		var newurl = vm.urlHour + "/" + date + "&" + room;
		$http.get(newurl)
		.success(function (res){
			if(res.length > 0){
				vm.getHoursFromAgenda(res[0].agenda);
			}
		})
		.error(function(err){
			alert('warning',"FAIL");
		});
	};

	vm.getHoursFromAgenda = function(agenda){
		var newurl = vm.urlHour + "/u/" + agenda;
		$http.get(newurl)
		.success(function (res){
			vm.hourList = res;
			vm.getAgendaDetail(res.agenda);
			vm.calculateHourRage();
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