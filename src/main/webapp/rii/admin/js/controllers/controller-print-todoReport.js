/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Todos Report Controller
issueTrackerApp.controller("PrintTodoReportController", function($scope, $routeParams, $location, $filter, pageService, issueService, contactService, statusService, todoService, utilService){
	var criteria = $routeParams.criteria,
	newPage = {
		isDetailPage : true,
		issueFilterReport : {},
		createLabel : "Print",
		isLinkReportPage : true,
		isSubHeadingPanel : true,
		title : "View Todos List",
		reportUrl : "report/todos",
		reportLabel : "Generate Todos Report",
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || [],
		todoFilterReport : pageService.getPage().todoFilterReport || {}
	};
	
	//Load Todos List
	(function(){
		//Show Animation
		$scope.$emit('LOADPAGE');
		//var todoFilter = JSON.parse(criteria); // convert JSON string into Object
		if (utilService.isValidObject(newPage.todoFilterReport)) {
			todoService.loadTodoReport(newPage.todoFilterReport, function(data, message){
				$scope.todosList = data;
				newPage.todoFilterReport = {};
				
				//Hide Animation
				$scope.$emit('UNLOADPAGE');
			});
		} else {
			//TODO: will implement
			
			//Hide Animation
			$scope.$emit('UNLOADPAGE');
		}
		
	})();
	
	var doNewAction = function(){
		var printContents = document.getElementById("reportContents").innerHTML,
		originalContents = document.body.innerHTML,
		screenSize = utilService.getScreenSize(),
		width = screenSize.width < 800 ? screenSize.width + ((screenSize.width * 2)/10) : screenSize.width - ((screenSize.width * 2)/100),
		height = screenSize.height < 600? screenSize.height + ((screenSize.height * 6)/10) : screenSize.height,
		showScreen = "width=" + width + ",height=" + height,
		popupWindow = window.open('', '_blank', showScreen);
		
		popupWindow.document.open();
		popupWindow.document.write('<html><head><title>Rii Issues Tracker</title><link rel="stylesheet" type="text/css" href="../css/print.css" media="print" /></head><body onload="window.print()">' + printContents + '</body></html>');
		popupWindow.document.close();
	};
	
	//$scope.params = $routeParams;
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
});