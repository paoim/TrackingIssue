/********************************************
 ** Author: Pao Im
 ** Email: paoim@yahoo.com
 *********************************************/
var basicAnimationApp = angular.module("basicAnimationApp", [ "ngRoute", "ui.bootstrap" ]);

basicAnimationApp.controller("MainCtrl", function($scope) {
	$scope.$on('LOAD', function(){
		$scope.isLoading = true;
	});
	$scope.$on('UNLOAD', function(){
		$scope.isLoading = false;
	});
});

basicAnimationApp.controller("BasicAnimationCtrl", function($scope, $http) {
	$scope.$emit('LOAD');
	$http.jsonp('http://filltext.com/?rows=10&delay=5&fname={firstName}&callback=JSON_CALLBACK').success(function(data){
		$scope.people = data;
		$scope.$emit('UNLOAD');
	});
});


//http://jsfiddle.net/jpamorgan/YqCmU/1/
//http://plnkr.co/edit/uW4v9T?p=preview
//http://www.youtube.com/watch?v=mMxQHmvQ1pA
// http://codepen.io/georgehastings/pen/skznp
// http://plnkr.co/edit/vurf2Pm33Dam9IUitgrC?p=preview
// http://plnkr.co/edit/uW4v9T?p=info