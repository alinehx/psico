'use strict';

app.controller('RemanejaCtrl', function ($scope, $rootScope, $http, alert, authToken, $state, $cookies, globalized) {
	var actualHost = globalized;
	var vm = this;
	vm.state = $state;
	vm.urlAgenda = actualHost + '/agenda';
	vm.urlGuest = actualHost + '/guest';
	vm.urlRemaneja = actualHost + '/remaneja';

		//DefaultSettings
	$(document).ready(function(){
		$('#mainHeader').show();
		$('mainFooter').show();
		$("body").removeClass('not-occupied');
		$("body").removeClass('occupied');
	});

	vm.setMine = false;
	vm.byTarget = {};
	vm.byOwner = {};
	vm.remanejaList = {};
	vm.rem = {};
	vm.loadedAgenda = {};
	vm.forMe = {};
	vm.toMe = {};
	vm.hasNone = false;

	vm.remaneja = {
		agenda: null,
		target: null,
		owner: null,
		resp: null,
		status: null,
	}

	vm.loadEssentialData = function(){
		var user = $cookies.get("loggedUserMail");
		vm.getByTarget(user);
		vm.getByOwner(user);
	};

	vm.gotoRemaneja = function(id){
		$state.go('remaneja', { 
			id: id
		});
	};

	vm.goToAgenda = function(){
		$state.go('agendarema', { 
			agendaID: vm.loadedAgenda.id
		});
	}

	//AJAX
	vm.remanejaForAgenda = function (agenda){
		var agendaUrl = vm.urlAgenda + "/a/" + agenda;

		$http.get(agendaUrl)
		.success(function (res){
			vm.loadedAgenda = res;
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição. " + err.message);
		});
	};


	vm.loadUniqueRemaneja = function(id){
		var newurl = vm.urlRemaneja + "/" + id;

		$http.get(newurl)
		.success(function (res){
			vm.rem = res;
			vm.remanejaForAgenda(res.agenda);
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	}

	vm.getAll = function (){
		$http.get(vm.urlRemaneja)
		.success(function (res){
			alert('success',"Requisição realizada com sucesso.");
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};


	vm.getByTarget = function (user){
		var newurl = vm.urlRemaneja + "/rt/" + user;
		console.log(newurl);
		$http.get(newurl)
		.success(function (res){
			console.log(res);
			vm.forMe = res;
			console.log(vm.forMe);
			if(vm.forMe.length == 0 && vm.toMe.length == 0){
				vm.hasNone = true;
			}
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};

	vm.getByOwner = function (user){
		var newurl = vm.urlRemaneja + "/ro/" + user;
		$http.get(newurl)
		.success(function (res){
			vm.toMe = res;
			if(vm.forMe.length == 0 && vm.toMe.length == 0){
				vm.hasNone = true;
			}
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

	vm.updateRemaneja = function(remaneja, resposta){
		var preparedUrl = vm.urlRemaneja + "/" + remaneja.id;
		var newRemaneja = {
			resp: resposta,
			status: true
		};
		$http.put(preparedUrl, newRemaneja)
		.success(function(res){
			alert('success','Sucesso!', 'Resposta enviada com sucesso.');
		})
		.error(function(err){
			alert('warning',"Error!", "Não foi possivel executar a requisição." + err);
		});
	}

	vm.doAccept = function(item){
		vm.updateRemaneja(item, 'A');
		$state.go('remanejamentos');
	}

	vm.doReject = function(item){
		vm.updateRemaneja(item, 'R');
		$state.go('remanejamentos');
	}

	vm.isEmpty = function(item){
		if(item.length < 1){
			return true;
		}
		return false;
	};

	vm.isWaiting = function(response){
		return response.status;
	}

	vm.getResp = function(response){
		if(response.resp == 'A'){
			return true;
		} else if(response.resp == 'R'){
			return false;
		}
	}

	vm.validateAlpabeticField = function(info){

    if(info == 'null' || info == undefined)
      return false;

    var re = /^[A-Za-zà-úÀ-Ú0-9 \s]*$/;
    return re.test(info);
  };

  vm.validateIsFilled = function(info){

    if(info == 'null' || info == undefined)
      return false;

    return true;
  };

	vm.validateTelField = function(info){
    if(info == 'null' || info == undefined)
      return false;

    if(info.length < 10)
      return false;

    var re = /^[0-9 \s]*$/
    return re.test(info);
  };

  vm.validateLettersField = function(info){
    if(info == 'null' || info == undefined)
      return false;

    var re = /^[A-Za-zà-úÀ-Ú \s]*$/;
    return re.test(info);
  };

  vm.validateNumericField = function(info){
    if(info == 'null' || info == undefined)
      return false;

    if(info < 0)
      return false;

    var re = /^[0-9 \s]*$/
    return re.test(info);
  };

  vm.validateMailField = function(info){
    if(info == 'null' || info == undefined)
      return false;

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(info);
  };

});