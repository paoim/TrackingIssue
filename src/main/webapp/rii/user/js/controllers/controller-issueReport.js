/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Issue Report Controller
issueTrackerApp.controller("IssueReportController", function($scope, $routeParams, $location, $filter, pageService, issueService, contactService, statusService, utilService){
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
	
	// Any function returning a promise object can be used to load values asynchronously
	$scope.getPartNum = function(partNum) {
		var query = "PartNum like '" + partNum + "%'";
//		return issueService.filterPartNum(query).then(function(response){
//			return response.data.map(function(item){
//				return item.partNum;
//			});
//		});
		
		//Start searching partNum when it has more than 2 characters
		if(partNum.length >= 3){
			return issueService.filterIssues(query).then(function(response){
				return response.data.map(function(item){
					return item.partNum;
				});
			});
		}
		else{
			return [];
		}
	};
//	$scope.getIssueId = function(issueId){
//		var query = "ISSUE_ID=" + issueId;
//		return issueService.filterIssues(query).then(function(response){
//			return response.data.map(function(item){
//				return item.id;
//			});
//		});
//	};
	(function(){
		issueService.loadIssues(function(issues, message){
			var issueIds = [];
			for(var i = 0; i < issues.length; i++){
				issueIds.push(issues[i].id);
			}
			$scope.issueIds = issueIds;
		});
	})();
	(function(){
		contactService.loadContacts(function(contacts, message){
			var contactByItems = [];
			for(var i = 0; i < contacts.length; i++){
				var name = "",
				contact = contacts[i];
				
				if(contact.firstName){
					name = contact.firstName + ' ';
				}
				if(contact.lastName){
					name = name + contact.lastName;
				}
				
				var openedBy = {id : contact.id, name : name};
				contactByItems.push(openedBy);
			}
			$scope.contactByItems = contactByItems;
		});
	})();
	(function(){
		statusService.loadStatusItems(function(statusItems, message){
			$scope.statusItems = statusItems;
		});
	})();
	
	$scope.issueReportFilter = 'default';
	
	$scope.viewReport = function(){
		var query = "default",
		filter = $scope.issueReportFilter,
		redirectUrl = "/report/issues/",
		startDate = $scope.startDate,
		endDate = $scope.endDate,
		criteria = $scope.criteria;
		
		if(filter == 'date'){
			if(startDate && endDate){
				//Add one day if equal date
				if(utilService.getStrDateDDMMYYYY(startDate) == utilService.getStrDateDDMMYYYY(endDate)){
					endDate = utilService.addDays(startDate, 1);
				}
				
				endDate = $filter('date')(endDate,'yyyy-MM-dd');
				startDate = $filter('date')(startDate,'yyyy-MM-dd');
				query = "where ((iss.openedDate >= '" + startDate + "' and iss.openedDate <= '" + endDate + "') or (iss.dueDate >= '" + startDate + "' and iss.dueDate <= '" + endDate + "'))";
			}
		}
		else if(filter == 'criteria'){
			if(criteria){
				query = "";
				if(criteria.issueId){
					query = query + "iss.ISSUE_ID = " + criteria.issueId + " and ";
				}
				if(criteria.partNum){
					query = query + "iss.partNum = '" + criteria.partNum + "' and ";
				}
				if(criteria.openedBy){
					query = query + "iss.openedBy = " + criteria.openedBy.id + " and ";
				}
				if(criteria.status){
					query = query + "iss.status = " + criteria.status.id;
				}
				
				if (query.length > 0) {
					if(utilService.endsWith(query, " and ") > 0){
						query = query.substring(0, query.length - " and ".length);
					}
					
					query = "where " + query;
				}
			}
		}
		
		redirectUrl = redirectUrl + encodeURI(query);
		$location.path(redirectUrl);//redirect to View Quick Part page
	};
	
	$scope.resetReport = function() {
		$scope.endDate = "";
		$scope.startDate = "";
		$scope.criteria = {};
		//checkSearchInput();
	};
	
	pageService.setPage(newPage);
});