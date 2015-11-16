/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Report Controller
issueTrackerApp.controller("SettingController", function($scope, pageService) {
	var newPage = {
			isDetailPage : false,
			isNotDisplaySubPanelHeading : true,
			isAlreadyLogin : pageService.getPage().isAlreadyLogin,
			isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
			isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
			//Keep to store issues
			storeIssues : pageService.getPage().storeIssues || []
	};
	
	pageService.setPage(newPage);
});
