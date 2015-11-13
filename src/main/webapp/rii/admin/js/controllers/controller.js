/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
// Create Navigation Controller
issueTrackerApp.controller("NavigationController", [ "$scope", "$location", "pageService", function($scope, $location, pageService) {
	$scope.page = pageService;
	$scope.isActiveClass = function(path) {
		return $location.path().substr(0, path.length) == path;
	};
} ]);

//Create Main Controller
issueTrackerApp.controller("IssueTrackerController", function($scope, pageService){
	$scope.page = pageService;
	
	//Animation show/hide
	$scope.$on('LOADPAGE', function() {
		$scope.isPageLoading = true;
	});
	$scope.$on('UNLOADPAGE', function() {
		$scope.isPageLoading = false;
	});
	
	//Animation show/hide
	$scope.$on('LOADSEARCH', function() {
		$scope.isSearching = true;
	});
	$scope.$on('UNLOADSEARCH', function() {
		$scope.isSearching = false;
	});
});