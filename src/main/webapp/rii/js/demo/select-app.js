/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
var selectApp = angular.module("selectApp", [ "controllers" ]);
selectApp.controller('SampleCtrl', function($scope) {
	$scope.options = [ {
		name : 'Cambodia',
		value : 'Kingdom of Wonder'
	}, {
		name : 'Angkor Wat',
		value : 'Great Temple'
	} ];

	$scope.selectedOptionName = $scope.options[0];
	$scope.selectedOptionValue = $scope.options[0].value;
});

//Controllers Module
var controllers = angular.module("controllers", []);

//Create Controller by controllers Module
controllers.controller('ItemsController', function($scope) {
	$scope.items = [ {
		"objectID" : "1",
		"versionID" : "0",
		"versionName" : "CURRENT",
		"objectName" : "Campong Cham",
	}, {
		"objectID" : "2",
		"versionID" : "1",
		"versionName" : "version1",
		"objectName" : "Skun",
	} ];

	$scope.versions = [ {
		"id" : "0",
		"description" : "CURRENT",
		"name" : "CURRENT"
	}, {
		"id" : "1",
		"description" : "description of Version 1",
		"name" : "version1"
	}, {
		"id" : "2",
		"description" : "description of Version 2",
		"name" : "version2"
	}, {
		"id" : "3",
		"description" : "description of Version 3",
		"name" : "version3"
	} ];
});

controllers.controller('ObjectCtrl', function($scope) {
	$scope.items = [ {
		id : 1,
		name : "Select 1",
		option : {
			id : 1,
			name : 'Cambodia',
			value : 'Kindom of Wonder'
		}
	}, {
		id : 2,
		name : "Select 2",
		option : {
			id : 2,
			name : 'Angkor Wat',
			value : 'Great Architechure'
		}
	} ];
	$scope.options = [ {
		id : 1,
		name : 'Phnom Penh',
		value : 'Capital City of Cambodia'
	}, {
		id : 2,
		name : 'Royal University of Phnom Penh',
		value : 'Public University'
	} ];
});