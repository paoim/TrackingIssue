/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
// Create Navigation Controller
issueTrackerApp.controller("NavigationController", [ "$scope", "$location", function($scope, $location) {
	$scope.isActiveClass = function(path) {
		return $location.path().substr(0, path.length) == path;
	};
} ]);

//Create Main Controller
issueTrackerApp.controller("IssueTrackerController", function($scope, pageService){
	$scope.page = pageService;
	
	//Animation show/hide
	$scope.$on('LOAD', function(){
		$scope.isPageLoading = true;
	});
	$scope.$on('UNLOAD', function(){
		$scope.isPageLoading = false;
	});
});