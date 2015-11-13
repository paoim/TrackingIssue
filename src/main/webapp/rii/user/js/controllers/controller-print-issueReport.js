/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Issue Report Controller
issueTrackerApp.controller("PrintIssueReportController", function($scope, $routeParams, $filter, pageService, issueService, utilService){
	var bodyReport = "",
	criteria = $routeParams.criteria,
	newPage = {
			curPage : pageService.getPage().curPage,
			pageSize : pageService.getPage().pageSize,
			numberOfPages : pageService.getPage().numberOfPages,
			storeIssues : pageService.getPage().storeIssues || []
	};
	
	//Load Quick Part
	(function(){
		//Show Animation
		$scope.$emit('LOAD');
		
		issueService.quickPartReport(criteria, function(data, message){
			$scope.issues = data;
			//console.log(message);
			
			angular.forEach(data, function(issue){
				var partNum = "",
				custName = "",
				comments = "",
				openedDate = "",
				statusName = "",
				assignedToName = "",
				status = issue.status,
				assignedTo = issue.assignedTo;
				
				if (issue.partNum) {
					partNum = issue.partNum;
				}
				if (issue.custName) {
					custName = issue.custName;
				}
				if (assignedTo && assignedTo.firstName) {
					assignedToName = assignedTo.firstName;
				}
				if (assignedTo && assignedTo.lastName) {
					assignedToName = assignedToName.length > 0 ? assignedToName + ' ' + assignedTo.lastName : assignedTo.lastName;
				}
				if (status && status.name) {
					statusName = status.name;
				}
				if (issue.openedDate) {
					openedDate = $filter('date')(issue.openedDate, 'MM/dd/yyyy');
				}
				
				bodyReport += "<tr>" +
				"<td><span>" + partNum + "</span></td>" +
				"<td><span>" + custName + "</span></td>" +
				
				"<td>";
				var historicalProblemReport = "";
				angular.forEach(issue.historicalProblems, function(problem) {
					var versionProblem = "";
					if (problem.versionProblem) {
						versionProblem = problem.versionProblem;
					}
					historicalProblemReport += "<div>" +
					"<span>" + versionProblem + "</span>" +
					"</div>";
				});
				bodyReport += historicalProblemReport + 
				"</td>" +
				
				"<td>";
				var historicalFixReport = "";
				angular.forEach(issue.historicalFixes, function(fix) {
					var versionFix = "";
					if (fix.versionFix) {
						versionFix = fix.versionFix;
					}
					historicalFixReport += "<div>" +
					"<span>" + versionFix + "</span>" +
					"</div>";
				});
				bodyReport += historicalFixReport + 
				"</td>" +
				
				"<td><span>" + assignedToName + "</span></td>" +
				"<td><span>" + openedDate + "</span></td>" +
				"<td><span>" + statusName + "</span></td>" +
				"</tr>";
			});
			
			//Hide Animation
			$scope.$emit('UNLOAD');
		});
		
	})();
	
	$scope.printReport = function(){
		var totalIssues = $scope.issues.length,
		screenSize = utilService.getScreenSize(),
		printContents = document.getElementById("reportContents").innerHTML,
		width = screenSize.width < 800 ? screenSize.width + ((screenSize.width * 2)/10) : screenSize.width - ((screenSize.width * 2)/100),
		height = screenSize.height < 600? screenSize.height + ((screenSize.height * 6)/10) : screenSize.height,
		showScreen = "width=" + width + ",height=" + height,
		popupWindow = window.open('', '_blank', showScreen);
		
		if (totalIssues > 0) {
			printContents = "";
			var headerReport = "<div>" +
			"<table>" +
			"<tr>" +
			"<th><span>Part #</span></th>" +
			"<th><span>Customer Name</span></th>" +
			"<th><span>Historical Problems</span></th>" +
			"<th><span>Part/Process Fixes</span></th>" +
			"<th><span>Assigned To</span></th>" +
			"<th><span>Opened Date</span></th>" +
			"<th><span>Status</span></th>" +
			"</tr>";
			printContents = headerReport + bodyReport +  "</table></div>";
		}
		
		popupWindow.document.open();
		popupWindow.document.write('<html><head><title>Rii Issues Tracker</title><link rel="stylesheet" type="text/css" href="../css/print.css" media="print" /></head><body onload="window.print()">' + printContents + '</body></html>');
		popupWindow.document.close();
	};
	
	pageService.setPage(newPage);
});