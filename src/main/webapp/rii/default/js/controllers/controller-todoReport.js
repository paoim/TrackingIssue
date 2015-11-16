/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Todo Report Controller
issueTrackerApp.controller("TodoReportController", function($scope, $location, $filter, pageService, todoService, contactService, datePickerService, utilService) {
	var newPage = {
		isDetailPage : true,
		todoFilterReport : {},
		issueFilterReport : {},
		isDisplaySaveBtn : true,
		isLinkReportPage : true,
		reportUrl : "report/issues",
		createLabel : "View Report",
		title : "Generate Todos Report",
		reportLabel : "Generate Issue Report",
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	};
	
	//Date Picker
	$scope.initDatePicker = function() {
		var today = new Date(),
		date_10 = datePickerService.getDateAdd(10),
		date_80 = datePickerService.getDateMinus(80);
		
		$scope.minWhen = $scope.minWhen ? null : date_80;
		$scope.maxWhen = $scope.maxWhen ? null : date_10;
		$scope.maxEndDate = $scope.maxEndDate ? null : date_10;
		$scope.minStartDate = $scope.minStartDate ? null : date_80;
		$scope.maxStartDate = $scope.maxStartDate ? null : date_10;
		$scope.minDateEndDate = $scope.minDateEndDate ? null : today;
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
	$scope.openWhen = function($event) {
		eventHandler($event);
		
		$scope.openedWhen = true;
	};
	$scope.compareDates = function() {
		if ($scope.startDate && $scope.endDate && $scope.startDate > $scope.endDate) {
			alert("Start Date must be smaller than End Date.");
			$scope.endDate = "";
			$scope.startDate = "";
		}
	};
	
	// load auto completion data
	$scope.partNumList = [];
	$scope.$watch("criteria.partNum", function(partNum) {
		if (partNum && partNum.length >= 3) {
			todoService.loadPartNumTodo(partNum, function(items, message) {
				$scope.partNumList.length = 0;
				angular.forEach(items, function(item) {
					$scope.partNumList.push(item.partNum);
				});
				
				if ($scope.partNumList.length > 0) {
					var newPartNumList = utilService.removeDuplicateList($scope.partNumList);
					$scope.partNumList = newPartNumList;
				}
			});
		}
	});
	
	//load contacts
	(function() {
		//Show Animation
		$scope.$emit('LOADPAGE');
		contactService.loadContacts(function(data, message) {
			$scope.contacts = data;
			
			//Hide Animation
			$scope.$emit('UNLOADPAGE');
		});
	})();
	
	$scope.todoReportFilter = 'default';
	$scope.datePicker = datePickerService;
	
	var doNewAction = function() {
		var today = new Date(),
		endDate = $scope.endDate,
		criteria = $scope.criteria,
		startDate = $scope.startDate,
		redirectUrl = "/report/todos/",
		filter = $scope.todoReportFilter,
		currentDate = $filter('date')(today,'yyyy-MM-dd'),
		todoFilter = {isDefault : 1};
		
		if (filter == 'date') {
			if (startDate && endDate) {
				
				//Add one day if equal date
				if (utilService.getStrDateDDMMYYYY(startDate) == utilService.getStrDateDDMMYYYY(endDate)) {
					endDate = utilService.addDays(startDate, 1);
				}
				
				endDate = $filter('date')(endDate,'yyyy-MM-dd');
				startDate = $filter('date')(startDate,'yyyy-MM-dd');
				
				todoFilter.isDefault = 0;
				todoFilter.startDate = startDate;
				todoFilter.endDate = endDate;
			}
		} else if (filter == 'criteria') {
			if (criteria) {
				todoFilter.isDefault = 0;
				
				if (criteria.who) {
					todoFilter.who = criteria.who;
				}
				if (criteria.dueDate) {
					var dueDate = $filter('date')(criteria.dueDate,'yyyy-MM-dd');
					todoFilter.when = dueDate;
				}
				if (criteria.partNum) {
					todoFilter.partNum = criteria.partNum;
				}
				if (criteria.completed) {
					todoFilter.status = criteria.completed;
				}
			}
		}
		newPage.todoFilterReport = todoFilter;
		
		//redirectUrl = redirectUrl + encodeURI(query);
		//redirectUrl = redirectUrl + JSON.stringify(todoFilter);
		redirectUrl = redirectUrl + 'loadTodoReport';
		$location.path(redirectUrl);//redirect to View Quick Part page
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
});