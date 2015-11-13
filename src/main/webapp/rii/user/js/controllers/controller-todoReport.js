/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Todo Report Controller
issueTrackerApp.controller("TodoReportController", function($scope, $routeParams, $location, $filter, pageService, todoService, contactService, statusService, utilService){
	var newPage = {
			curPage : pageService.getPage().curPage,
			pageSize : pageService.getPage().pageSize,
			numberOfPages : pageService.getPage().numberOfPages,
			storeIssues : pageService.getPage().storeIssues || []
	};
	
	$scope.compareDates = function(){
		if($scope.startDate && $scope.endDate && $scope.startDate > $scope.endDate){
			alert("Start Date must be smaller than End Date.");
			$scope.endDate = "";
			$scope.startDate = "";
		}
	};
	
	//load contacts
	(function(){
		contactService.loadContacts(function(data, message){
			$scope.contacts = data;
		});
	})();
	
	$scope.todoReportFilter = 'default';
	
	$scope.viewReport = function(){
		var today = new Date(),
		endDate = $scope.endDate,
		criteria = $scope.criteria,
		startDate = $scope.startDate,
		redirectUrl = "/report/todos/",
		filter = $scope.todoReportFilter,
		currentDate = $filter('date')(today,'yyyy-MM-dd'),
		query = "isCompleted = 0 and DATE(dueDate) = DATE(NOW())";
		
		if(filter == 'date'){
			if(startDate && endDate){
				
				//Add one day if equal date
				if(utilService.getStrDateDDMMYYYY(startDate) == utilService.getStrDateDDMMYYYY(endDate)){
					endDate = utilService.addDays(startDate, 1);
				}
				
				endDate = $filter('date')(endDate,'yyyy-MM-dd');
				startDate = $filter('date')(startDate,'yyyy-MM-dd');
				query = "(dueDate >= '" + startDate + "' and dueDate <= '" + endDate + "')";
			}
		}
		else if(filter == 'criteria'){
			if(criteria){
				query = "";
				if(criteria.who){
					query = query + "who = " + criteria.who + " and ";
				}
				if(criteria.dueDate){
					var dueDate = $filter('date')(criteria.dueDate,'yyyy-MM-dd');
					query = query + "dueDate = '" + dueDate + "' and ";
				}
				if(criteria.completed){
					console.log(criteria.completed);
					query = query + "isCompleted = " + criteria.completed;
				}
				
				if (query.length > 0) {
					if(utilService.endsWith(query, " and ") > 0){
						query = query.substring(0, query.length - " and ".length);
					}
					
					//query = "where " + query;
				}
			}
		}
		
		redirectUrl = redirectUrl + encodeURI(query);
		$location.path(redirectUrl);
	};
	
	$scope.resetReport = function() {
		$scope.endDate = "";
		$scope.startDate = "";
		$scope.criteria = {};
		//checkSearchInput();
	};
	
	pageService.setPage(newPage);
});