/********************************************
 ** Author: Pao Im
 ** Email: paoim@yahoo.com
 *********************************************/
var basicSignupApp = angular.module("basicSignupApp", [ "ngRoute", "ui.bootstrap" ]);

basicSignupApp.controller("SignupController", function($scope) {
	$scope.master = {};
	$scope.user = {
		name : "test",
		email : "test@yahoo.com",
		gender : "male",
		agree : true,
		agreeSign : "test 123"
	};

	$scope.update = function(user) {
		$scope.master = angular.copy(user);
	};

	$scope.reset = function() {
		$scope.user = angular.copy($scope.master);
	};

	$scope.isUnchanged = function(user) {
		return angular.equals(user, $scope.master);
	};

	$scope.reset();

	// focus on the first input when the page loads
	window.focus = function(selector) {
		// timeout is needed for Chrome (is a bug in Chrome)
		setTimeout(function() {
			$(!!selector ? selector : "[autofocus]:not(:focus)").first().focus();
		}, 1);
	};
});


//http://plnkr.co/edit/?p=preview