/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Issue Report Controller
issueTrackerApp.controller("IssueReportController", function($scope, $routeParams, $location, $filter, pageService, issueService, contactService, statusService, datePickerService, utilService) {
	var newPage = {
		isDetailPage : true,
		todoFilterReport : {},
		issueFilterReport : {},
		isDisplaySaveBtn : true,
		isLinkReportPage : true,
		reportUrl : "report/todos",
		createLabel : "View Report",
		title : "Generate Issue Report",
		reportLabel : "Generate Todos Report",
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	};
	
	//Date Picker
	$scope.initDatePicker = function() {
		var today = new Date(),
		date_10 = datePickerService.getDateAdd(10),
		date_80 = datePickerService.getDateMinus(80);
		
		$scope.minDateEndDate = $scope.minDateEndDate ? null : today;
		$scope.minStartDate = $scope.minStartDate ? null : date_80;
		$scope.maxStartDate = $scope.maxStartDate ? null : date_10;
		$scope.maxEndDate = $scope.maxEndDate ? null : date_10;
	};
	$scope.initDatePicker();
	
	var eventHandler = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
	};
	$scope.openStartDate = function($event) {
		eventHandler($event);
		
		$scope.openedEndDate = false;
		$scope.openedStartDate = true;
	};
	$scope.openEndDate = function($event) {
		eventHandler($event);
		
		$scope.openedEndDate = true;
		$scope.openedStartDate = false;
	};
	$scope.compareDates = function() {
		if($scope.startDate && $scope.endDate && $scope.startDate > $scope.endDate) {
			alert("Start Date must be smaller than End Date.");
			$scope.endDate = "";
			$scope.startDate = "";
		}
	};
	
	// Any function returning a promise object can be used to load values asynchronously
	$scope.getPartNum = function(partNum) {
		var query = "PartNum like '" + partNum + "%'";
		//Start searching partNum when it has more than 2 characters
		if(partNum.length >= 3) {
			return issueService.filterIssues(query).then(function(response) {
				return response.data.map(function(item) {
					return item.partNum;
				});
			});
		}
		else{
			return [];
		}
	};
//	$scope.getIssueId = function(issueId) {
//		var query = "ISSUE_ID=" + issueId;
//		return issueService.filterIssues(query).then(function(response) {
//			return response.data.map(function(item) {
//				return item.id;
//			});
//		});
//	};
	(function() {
		//Show Animation
		$scope.$emit('LOADPAGE');
		
		issueService.loadIssues(function(issues, message) {
			var issueIds = [];
			for(var i = 0; i < issues.length; i++) {
				issueIds.push(issues[i].id);
			}
			$scope.issueIds = issueIds;
			
			//Hide Animation
			$scope.$emit('UNLOADPAGE');
		});
	})();
	(function() {
		contactService.loadContacts(function(contacts, message) {
			var contactByItems = [];
			for(var i = 0; i < contacts.length; i++) {
				var name = "",
				contact = contacts[i];
				
				if(contact.firstName) {
					name = contact.firstName + ' ';
				}
				if(contact.lastName) {
					name = name + contact.lastName;
				}
				
				var contactBy = {id : contact.id, name : name};
				contactByItems.push(contactBy);
			}
			$scope.contactByItems = contactByItems;
		});
	})();
	(function() {
		statusService.loadStatusItems(function(statusItems, message) {
			$scope.statusItems = statusItems;
		});
	})();
	
	$scope.issueReportFilter = 'default';
	$scope.datePicker = datePickerService;
	
	var doNewAction = function() {
		var filter = $scope.issueReportFilter,
		redirectUrl = "/report/issues/",
		startDate = $scope.startDate,
		endDate = $scope.endDate,
		criteria = $scope.criteria,
		issueFilter = {isDefault : 1};
		
		if (filter == 'date') {
			if (startDate && endDate) {
				//Add one day if equal date
				if(utilService.getStrDateDDMMYYYY(startDate) == utilService.getStrDateDDMMYYYY(endDate)) {
					endDate = utilService.addDays(startDate, 1);
				}
				
				endDate = $filter('date')(endDate,'yyyy-MM-dd');
				startDate = $filter('date')(startDate,'yyyy-MM-dd');
				issueFilter.isDefault = 0;
				issueFilter.endDate = endDate;
				issueFilter.startDate = startDate;
			}
		} else if (filter == 'criteria') {
			if (criteria) {
				issueFilter.isDefault = 0;
				
				if(criteria.issueId) {
					issueFilter.issueId = criteria.issueId;
				}
				if(criteria.partNum) {
					issueFilter.partNum = criteria.partNum;
				}
				if(criteria.openedBy) {
					issueFilter.opendBy = criteria.openedBy.id;
				}
				if(criteria.assignedTo) {
					issueFilter.assignedTo = criteria.assignedTo.id;
				}
				if(criteria.status) {
					issueFilter.status = criteria.status.id;
				}
			}
		}
		newPage.issueFilterReport = issueFilter;
		
		//redirectUrl = redirectUrl + encodeURI(query);
		//redirectUrl = redirectUrl + JSON.stringify(issueFilter); // convert Object into JSON string
		redirectUrl = redirectUrl + 'loadIssueReport';
		$location.path(redirectUrl); //redirect to View Quick Part page
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
});
