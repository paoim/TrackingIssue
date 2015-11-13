/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Report Controller
issueTrackerApp.controller("ReportController", function($scope, $routeParams, $location, $filter, pageService, todoService, contactService, statusService, datePickerService, utilService){
	var newPage = {
			isDetailPage : true,
			isReportPage : true,
			//Keep to store issues
			storeIssues : pageService.getPage().storeIssues || []
	};
	
	pageService.setPage(newPage);
});