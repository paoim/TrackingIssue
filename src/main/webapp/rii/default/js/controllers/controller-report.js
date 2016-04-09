/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Report Controller
issueTrackerApp.controller("ReportController", function($scope, $routeParams, $location, $filter, pageService, todoService, contactService, statusService, datePickerService, utilService){
	var newPage = {
			isDetailPage : true,
			isReportPage : true,
			isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
			isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
			//Keep to store issues
			storeIssues : pageService.getPage().storeIssues || []
	};
	
	pageService.setPage(newPage);
});
