/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
var issueTrackerServices = angular.module("issueTrackerServices", ["genericDataService", "inputFileModule",  "genericUtilService", "genericDatePickerService"]);

//Create Page Service
issueTrackerServices.factory("pageService", function($rootScope){
	//private variable
	var page = {
		curPage : 0,
		pageSize : 50,//number of items per page
		storeIssues : [],
		numberOfPages : 1,
		isSearchForm : true,
		isListingPage : true
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