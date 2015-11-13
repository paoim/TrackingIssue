/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Issue Report Controller
issueTrackerApp.controller("PrintIssueReportController", function($scope, $routeParams, pageService, issueService, utilService) {
	var criteria = $routeParams.criteria,
	newPage = {
		isDetailPage : true,
		todoFilterReport : {},
		createLabel : "Print",
		isLinkReportPage : true,
		title : "View Quick Part",
		reportUrl : "report/issues",
		reportLabel : "Generate Issue Report",
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || [],
		issueFilterReport : pageService.getPage().issueFilterReport || {}
	};
	
	//Load Quick Part
	(function() {
		//Show Animation
		$scope.$emit('LOADPAGE');
		//var issueFilter = JSON.parse(criteria); // convert JSON string into Object
		if (utilService.isValidObject(newPage.issueFilterReport)) {
			issueService.quickPartReport(newPage.issueFilterReport, function(data, message) {
				$scope.issues = data;
				newPage.issueFilterReport = {};
				//console.log(message);
				
				//Hide Animation
				$scope.$emit('UNLOADPAGE');
			});
		} else {
			//TODO: will implement
			
			//Hide Animation
			$scope.$emit('UNLOADPAGE');
		}
		
	})();
	
	var doNewAction = function() {
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
	pageService.setClick(doNewAction);
});
