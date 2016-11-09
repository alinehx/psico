'use strict';

app.controller('SlaveCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, globalized) {
	var actualHost = globalized;
	var vm = this;
	vm.state = $state;
	vm.urlAgenda = actualHost + '/agenda';
	vm.urlRoom = actualHost + '/class';
	vm.urlGuest = actualHost + '/guest';
	vm.urlHour = actualHost + '/hours';
	vm.urlUser = actualHost + '/user';

	vm.roomList = [];
	vm.hourList = [];
	vm.guestList = [];

	vm.agendaDetails = {};
	vm.guestObject = {};

	vm.actualRoom = null;
	vm.actualDate = null;

	vm.reflectedRoom = {};
	vm.reflectedHour = {};
	vm.reflectedAgenda = {};
	vm.roomState = "";

	vm.isLoading = true;



	vm.updateGuestAcceptFlag = function(status){
		var agenda = vm.state.params.agenda;
		var guest = vm.state.params.guest;

		var newurl = vm.urlGuest + "/" + agenda + "&" + guest;
		var newObject = {
			accepted: status
		}
		$http.put(newurl, newObject)
		.success(function (res){
			$state.go('agendadetails',{
				agendaID: agenda
			});
		})
		.error(function(err){
			alert('warning',"FAIL");
		});
	};

	vm.setPageInfo = function(){
		var agenda = vm.state.params.agenda;
		var guest = vm.state.params.guest;
		vm.getAgenda(agenda);
		vm.getGuest(agenda, guest);
	};

	vm.getAgenda = function(agenda){
		var newurl = vm.urlAgenda + "/a/" + agenda;
		$http.get(newurl)
		.success(function (res){
			vm.agendaDetails = res;
		})
		.error(function(err){
			alert('warning',"FAIL");
		});
	};

	vm.getGuest = function(agenda, guest){
		var newurl = vm.urlGuest + "/g/" + agenda + "&" + guest;
		$http.get(newurl)
		.success(function (res){
			vm.guestObject = res;
		})
		.error(function(err){
			alert('warning',"FAIL");
		});
	};

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
		console.log('a');
		vm.getRoomByID(roomid, vm.actualDate);
	}

	vm.getRoomByID = function(id, date){
		var newurl = vm.urlRoom + "/u/" + id;
		console.log('b');
		$http.get(newurl)
		.success(function (res){
			vm.reflectedRoom = res;
			console.log('c', res);
			vm.getHoursForRoomAndDay(id, date);
		})
		.error(function(err){
			alert('warning',"FAILED. Contact the support.");
		});
	};

	vm.canShowAgendaInfo = function(){
		var yes = false;
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
		vm.setHourCounter(endTime);
	};

	vm.getHoursForRoomAndDay = function(room, date){
		console.log('d');
		var newurl = vm.urlHour + "/s/" + date + "&" + room;
		$http.get(newurl)
		.success(function (res){
			console.log('e', res);
			if(res.length > 0){
				vm.findAgendaForHour(res);
			} else{
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
		console.log('f');
		hourList.forEach(function(h){
			if(c == 0 && h.hour == preparedHour){
				c++;
				if(h.agenda != null){
					console.log('g', h);
					vm.roomState = "OCUPADA";
					vm.getHoursFromAgenda(h.agenda);
				} else {
					//TODO
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
		console.log('h');
		$http.get(newurl)
		.success(function (res){
			vm.reflectedAgenda = res;
			vm.getUserDetails(res.responsable);
			vm.getGuestList(agendaID);
			vm.setHourCounter(res.endTime);
		})
		.error(function(err){
			alert('warning',"FAIL");
		});
	};

	vm.getUserDetails = function(userID){
		var newurl = vm.urlUser + '/' + userID;
		$http.get(newurl)
		.success(function (res){
			vm.reflectedUser = res;
		})
		.error(function(err){
			alert('warning',"FAIL");
		});
	};

	vm.getGuestList = function(agendaID){
		var newurl = vm.urlGuest + '/' + agendaID;
		$http.get(newurl)
		.success(function (res){
			vm.guestList = res;
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
					room: vm.reflectedRoom.id
				});
			}
		},1000);
	}

	//counter
	function getTimeRemaining(endtime){
		var time = Date.parse(endtime) - Date.parse(new Date());
		var seconds = Math.floor( (time/1000) % 60 );
		var minutes = Math.floor( (time/1000/60) % 60 );
		var hours = Math.floor( (time/(1000*60*60)) % 24 );
		var days = Math.floor( time/(1000*60*60*24) );
		return {
			'total': time,
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