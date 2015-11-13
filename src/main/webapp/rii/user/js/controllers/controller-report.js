/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Report Controller
issueTrackerApp.controller("ReportController", function($scope, $routeParams, $location, $filter, pageService, todoService, contactService, statusService, datePickerService, utilService){
	var newPage = {
			curPage : pageService.getPage().curPage,
			pageSize : pageService.getPage().pageSize,
			numberOfPages : pageService.getPage().numberOfPages,
			storeIssues : pageService.getPage().storeIssues || []
	};
	
	pageService.setPage(newPage);
});