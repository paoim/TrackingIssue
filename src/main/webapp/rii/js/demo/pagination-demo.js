/********************************************
 ** Author: Pao Im
 ** Email: paoim@yahoo.com
 *********************************************/
var paginationApp = angular.module("paginationApp",
		[ "ngRoute", "ui.bootstrap" ]);

paginationApp.controller("PaginationDemoCtrl", function($scope) {
	$scope.friends = [ {
		'name' : 'Jack'
	}, {
		'name' : 'Tim'
	}, {
		'name' : 'Stuart'
	}, {
		'name' : 'Richard'
	}, {
		'name' : 'Tom'
	}, {
		'name' : 'Frank'
	}, {
		'name' : 'Ted'
	}, {
		'name' : 'Michael'
	}, {
		'name' : 'Albert'
	}, {
		'name' : 'Tobby'
	}, {
		'name' : 'Mick'
	}, {
		'name' : 'Nicholas'
	}, {
		'name' : 'Jesse'
	}, {
		'name' : 'Lex'
	}, {
		'name' : 'Robbie'
	}, {
		'name' : 'Jake'
	}, {
		'name' : 'Levi'
	}, {
		'name' : 'Edward'
	}, {
		'name' : 'Neil'
	}, {
		'name' : 'Hugh'
	}, {
		'name' : 'Hugo'
	}, {
		'name' : 'Yanick'
	}, {
		'name' : 'Matt'
	}, {
		'name' : 'Andrew'
	}, {
		'name' : 'Charles'
	}, {
		'name' : 'Oliver'
	}, {
		'name' : 'Robin'
	}, {
		'name' : 'Harry'
	}, {
		'name' : 'James'
	}, {
		'name' : 'Kelvin'
	}, {
		'name' : 'David'
	}, {
		'name' : 'Paul'
	} ];
	
	$scope.totalItems = $scope.friends.length;
	$scope.currentPage = 4;
	$scope.itemsPerPage = 10;

	$scope.setPage = function(pageNo) {
		$scope.currentPage = pageNo;
		console.log('Current Page: ' + pageNo);
	};

	$scope.pageChanged = function() {
		console.log('Page changed to: ' + $scope.currentPage);
	};

	$scope.maxSize = 5;
	$scope.bigTotalItems = 175;
	$scope.bigCurrentPage = 1;
});

paginationApp.controller("ContentCtrl", function($scope){
	$scope.friends = [ {
		'name' : 'Jack'
	}, {
		'name' : 'Tim'
	}, {
		'name' : 'Stuart'
	}, {
		'name' : 'Richard'
	}, {
		'name' : 'Tom'
	}, {
		'name' : 'Frank'
	}, {
		'name' : 'Ted'
	}, {
		'name' : 'Michael'
	}, {
		'name' : 'Albert'
	}, {
		'name' : 'Tobby'
	}, {
		'name' : 'Mick'
	}, {
		'name' : 'Nicholas'
	}, {
		'name' : 'Jesse'
	}, {
		'name' : 'Lex'
	}, {
		'name' : 'Robbie'
	}, {
		'name' : 'Jake'
	}, {
		'name' : 'Levi'
	}, {
		'name' : 'Edward'
	}, {
		'name' : 'Neil'
	}, {
		'name' : 'Hugh'
	}, {
		'name' : 'Hugo'
	}, {
		'name' : 'Yanick'
	}, {
		'name' : 'Matt'
	}, {
		'name' : 'Andrew'
	}, {
		'name' : 'Charles'
	}, {
		'name' : 'Oliver'
	}, {
		'name' : 'Robin'
	}, {
		'name' : 'Harry'
	}, {
		'name' : 'James'
	}, {
		'name' : 'Kelvin'
	}, {
		'name' : 'David'
	}, {
		'name' : 'Paul'
	} ];

	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	
	$scope.pageCount = function () {
		return Math.ceil($scope.friends.length / $scope.itemsPerPage);
	};

	//$scope.friends.$promise.then(function () {
		$scope.totalItems = $scope.friends.length;
		$scope.$watch('currentPage + itemsPerPage', function() {
			var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
			end = begin + $scope.itemsPerPage;
			
			$scope.filteredFriends = $scope.friends.slice(begin, end);
		});
	//});
});

paginationApp.controller('SampleContoller', function($scope) {

	$scope.showData = function() {

		$scope.curPage = 0;
		$scope.pageSize = 10;
		$scope.datalists = [ {
			"name" : "John",
			"age" : "16",
			"designation" : "Software Engineer1"
		}, {
			"name" : "John2",
			"age" : "21",
			"designation" : "Software Engineer2"
		}, {
			"name" : "John3",
			"age" : "19",
			"designation" : "Software Engineer3"
		}, {
			"name" : "John4",
			"age" : "17",
			"designation" : "Software Engineer4"
		}, {
			"name" : "John5",
			"age" : "21",
			"designation" : "Software Engineer5"
		}, {
			"name" : "John6",
			"age" : "31",
			"designation" : "Software Engineer6"
		}, {
			"name" : "John7",
			"age" : "41",
			"designation" : "Software Engineer7"
		}, {
			"name" : "John8",
			"age" : "16",
			"designation" : "Software Engineer8"
		}, {
			"name" : "John18",
			"age" : "16",
			"designation" : "Software Engineer9"
		}, {
			"name" : "John28",
			"age" : "16",
			"designation" : "Software Engineer10"
		}, {
			"name" : "John38",
			"age" : "16",
			"designation" : "Software Engineer11"
		}, {
			"name" : "John48",
			"age" : "16",
			"designation" : "Software Engineer12"
		}, {
			"name" : "John58",
			"age" : "16",
			"designation" : "Software Engineer13"
		}, {
			"name" : "John68",
			"age" : "16",
			"designation" : "Software Engineer14"
		}, {
			"name" : "John68",
			"age" : "16",
			"designation" : "Software Engineer15"
		} ]
		$scope.numberOfPages = function() {
			return Math.ceil($scope.datalists.length / $scope.pageSize);
		};

	}

});

angular.module('paginationApp').filter('pagination', function() {
	return function(input, start) {
		start = +start;
		return input.slice(start);
	};
});


// Pagination Examples
//http://angulartutorial.blogspot.com/2014/03/client-side-pagination-using-angular-js.html
//http://www.michaelbromley.co.uk/blog/108/paginate-almost-anything-in-angularjs
// http://jsfiddle.net/prash/Cp73s/330/light/
// http://plnkr.co/edit/Wtkv71LIqUR4OhzhgpqL?p=preview
// http://weblogs.asp.net/dwahlin/building-an-angularjs-modal-service