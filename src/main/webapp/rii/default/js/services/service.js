/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
var issueTrackerServices = angular.module("issueTrackerServices", ["genericDataService", "inputFileModule", "genericUtilService", "genericDatePickerService"]);

//Create Page Service
issueTrackerServices.factory("pageService", function($rootScope){
	//private variable
	var page = {
		id : 1,
		storeIssues : [],
		isDetailPage : false,
		todoFilterReport : {},
		issueFilterReport : {},
		title : "Issues List",
		todoLabel : "Todo List",
		isLinkReportPage : false,
		isDisplaySaveBtn : false,
		isUploadExcelFile : false,
		isAlreadySendToEveryOne : false,
		isAlreadySendToSupervisor : false,
		createLabel : "New Issue",
		printUrl : "issues/report",
		printLabel : "Generate Issue Report",
		uploadLabel : "Click to upload Issues",
		createUrl : "issues/issue/view/newIssue"
	},
	
	//private method
	doAction = function(){
		//Will implement on detail page
	},
	todoAction = function(){
		//Will implement on Issue Detail page
	};
	
	return{
		//public functions
		getPage : function(){
			return page;
		},
		setPage : function(newPage){
			page = newPage;
		},
		doClick : function(){
			doAction();
		},
		todoClick : function(){
			todoAction();
		},
		setClick : function(doNewAction){
			doAction = doNewAction;
		},
		setTodoClick : function(newTodoAction){
			todoAction = newTodoAction;
		}
	};
});