/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Todos Report Controller
issueTrackerApp.controller("PrintTodoReportController", function($scope, $routeParams, $location, $filter, pageService, todoService, utilService){
	var criteria = $routeParams.criteria,
	newPage = {
			curPage : pageService.getPage().curPage,
			pageSize : pageService.getPage().pageSize,
			numberOfPages : pageService.getPage().numberOfPages,
			storeIssues : pageService.getPage().storeIssues || []
	};
	
	//Load Todos List
	(function(){
		//Show Animation
		$scope.$emit('LOAD');
		
		todoService.loadTodoReport(criteria, function(data, message){
			$scope.todosList = data;
			
			//Hide Animation
			$scope.$emit('UNLOAD');
		});
		
	})();
	
	$scope.printReport = function(){
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
	
	pageService.setPage(newPage);
});