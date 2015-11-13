/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
var issueTrackerServices = angular.module("issueTrackerServices", ["genericDataService", "inputFileModule", "genericUtilService", "genericDatePickerService"]);

//Create Page Service
issueTrackerServices.factory("pageService", function($rootScope) {
	var isAlreadyLogin = false;
	if ($rootScope.riiGlobals.currentUser) {
		isAlreadyLogin = true;
	}
	//private variable
	var page = {
		storeIssues : [],
		isDetailPage : false,
		todoFilterReport : {},
		issueFilterReport : {},
		isDisplaySaveBtn : false,
		isLinkReportPage : false,
		isUploadExcelFile : false,
		isAlreadyLogin : isAlreadyLogin,
		isAlreadySendToEveryOne : false,
		isAlreadySendToSupervisor : false,
		isNotDisplaySubPanelHeading : false,
		title : "Issues List",
		todoLabel : "Todo List",
		createLabel : "New Issue",
		printUrl : "issues/report",
		printLabel : "Generate Issue Report",
		uploadLabel : "Click to upload Issues",
		createUrl : "issues/issue/view/newIssue"
	},
	
	//private method
	doAction = function() {
		//Will implement on detail page
	},
	todoAction = function() {
		//Will implement on Issue Detail page
	};
	
	return{
		//public functions
		getPage : function() {
			return page;
		},
		setPage : function(newPage) {
			page = newPage;
		},
		doClick : function() {
			doAction();
		},
		todoClick : function() {
			todoAction();
		},
		setClick : function(doNewAction) {
			doAction = doNewAction;
		},
		setTodoClick : function(newTodoAction) {
			todoAction = newTodoAction;
		}
	};
});