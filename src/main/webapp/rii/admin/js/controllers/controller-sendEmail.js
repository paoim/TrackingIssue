/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Issue Report Controller
issueTrackerApp.controller("SendEmailController", function($scope, pageService, todoService) {
	var newPage = {
		isDetailPage : true,
		isNotDisplaySubPanelHeading : true,
		title : "Import Data from Excel to Data Store",
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	};
	
	$scope.isAlreadySendToEveryOne = newPage.isAlreadySendToEveryOne;
	$scope.isAlreadySendToSupervisor = newPage.isAlreadySendToSupervisor;
	
	$scope.sendEmailToEveryOne =function() {
		todoService.sendMailToEveryOne(function(data, message) {
			$scope.isAlreadySendToEveryOne = true;
			newPage.isAlreadySendToEveryOne = true;
			console.log(message);
		});
	};
	
	$scope.pushMailToEveryOne =function() {
		todoService.pushMailToEveryOne(function(data, message) {
			$scope.isAlreadySendToEveryOne = true;
			newPage.isAlreadySendToEveryOne = true;
			console.log(message);
		});
	};
	
	$scope.sendEmailToSupervisor =function() {
		todoService.sendMailToSupervisor(function(data, message) {
			$scope.isAlreadySendToSupervisor = true;
			newPage.isAlreadySendToSupervisor = true;
			console.log(message);
		});
	};
	
	$scope.pushMailToSupervisor =function() {
		todoService.pushMailToSupervisor(function(data, message) {
			$scope.isAlreadySendToSupervisor = true;
			newPage.isAlreadySendToSupervisor = true;
			console.log(message);
		});
	};
	
	pageService.setPage(newPage);
});
