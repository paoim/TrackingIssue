/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
// Create Login Service
issueTrackerServices.factory("loginService", function($rootScope, $location, $http, $cookieStore, $timeout, dataService, base64Service) {
	var service = {};
	
	service.login = function(username, password, callbackHandler) {
		$timeout(function() {
			var user = {
					username: username,
					password: password
			},
			response = {
					success : username === 'Admin' && password === 'Admin' //make default username and password
			};
			dataService.login("contacts/login", user, function(data) {
				if (!response.success) {
					if (!data) {
						response.message = 'Username or password is incorrect';
					} else {
						response.success = (username === data.username && password === data.password);
						if (!response.success) {
							response.message = 'Username or password is incorrect';
						}
					}
				}
				callbackHandler(response);
			},
			function(error) {
				if (!response.success) {
					response.message = 'Username or password is incorrect';
				}
				callbackHandler(response);
			});
		}, 1000);
	};
	
	service.setCredentials = function(username, password) {
		var authData = base64Service.encode(username + ':' + password);

		$rootScope.riiGlobals = {
			currentUser : {
				username : username,
				authData : authData
			}
		};

		$http.defaults.headers.common['Authorization'] = 'Basic ' + authData;
		$cookieStore.put('riiGlobals', $rootScope.riiGlobals);
	};

	service.clearCredentials = function() {
		$rootScope.riiGlobals = {};
		$cookieStore.remove('riiGlobals');
		$http.defaults.headers.common.Authorization = 'Basic ';
	};

	return service;
});
