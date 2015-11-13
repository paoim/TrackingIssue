/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
// Create Login Controller
issueTrackerApp.controller("LoginController", function($scope, $location, pageService, loginService) {
	var newPage = {
			isDetailPage : true,
			isAlreadyLogin : false,
			isNotDisplaySubPanelHeading : true,
			title : "Admin Application",
			isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
			isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
			//Keep to store issues
			storeIssues : pageService.getPage().storeIssues || []
	};
	
	// reset login status
	loginService.clearCredentials();
	
	var doNewAction = function() {
		
	};
	
	$scope.login = function() {
		loginService.login($scope.username, $scope.password, function(response) {
			if (response.success) {
				newPage.isAlreadyLogin = true;
				loginService.setCredentials($scope.username, $scope.password);
				$location.path('/issues');
			} else {
				$scope.error = response.message;
			}
		});
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
});
