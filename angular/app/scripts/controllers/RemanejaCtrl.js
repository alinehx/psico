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
	vm.forMe = {};
	vm.toMe = {};

	vm.remaneja = {
		agenda: null,
		target: null,
		owner: null,
		resp: null,
		status: null,
	}

	//AJAX
	vm.updateRemaneja = function(remaneja, resposta){
		console.log(remaneja.id);
		var preparedUrl = vm.urlRemaneja + "/" + remaneja.id;
		var newRemaneja = {
			resp: resposta,
			status: true
		};
		console.log("rema",newRemaneja);
		$http.put(preparedUrl, newRemaneja)
		.success(function(res){
			alert('success','Sucesso!', 'Resposta efetuada com sucesso.');
		})
		.error(function(err){
			alert('warning',"Error!", "Não foi possivel executar a requisição." + err);
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
	
	vm.loadEssentialData = function(){
		var user = $cookies.get("loggedUserMail");
		vm.getByTarget(user);
		vm.getByOwner(user);
	};

	vm.defaultResponse = {
		
	}

	vm.getByTarget = function (user){
		var newurl = vm.urlRemaneja + "/rt/" + user;
		console.log(newurl);
		$http.get(newurl)
		.success(function (res){
			vm.forMe = res;
			console.log("ByTarget OK", res);
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
			console.log("ByOwner OK", res);
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
		var newurl = vm.urlRemaneja + "/" + remaneja;
		$http.get(newurl)
		.success(function (res){
			alert('success',"Requisição realizada com sucesso.");
		})
		.error(function(err){
			alert('warning',"Error! Não foi possivel executar a requisição.");
		});
	};

	vm.doAccept = function(item){
		vm.updateRemaneja(item, 'A');
	}

	vm.doReject = function(item){
		vm.updateRemaneja(item, 'R');
	}

	vm.isWaiting = function(response){
		console.log("resposta", response.status);
		return response.status;
	}

	vm.getResp = function(response){
		if(response.resp == 'A'){
			return true;
		} else if(response.resp == 'R'){
			return false;
		}
	}

});