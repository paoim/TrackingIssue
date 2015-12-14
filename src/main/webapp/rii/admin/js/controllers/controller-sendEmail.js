/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Issue Report Controller
issueTrackerApp.controller("SendEmailController", function($scope, $filter, pageService, todoService) {
	var newPage = {
			title : "",
		isDetailPage : true,
		isNotDisplaySubPanelHeading : true,
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	};
	
	var fullDateFormat = $filter('date')(new Date(), 'yyyy-MM-dd hh:mm a'),
		hourFilters = fullDateFormat.split(' '),
		size = hourFilters.length;
	
	$scope.part = hourFilters[size - 1];
	$scope.hour = hourFilters[size - 2];
	
	$scope.isAlreadySendToEveryOne = newPage.isAlreadySendToEveryOne;
	$scope.isAlreadySendToSupervisor = newPage.isAlreadySendToSupervisor;
	
	$scope.$watch("hour", function(hour) {
		if (hour) {
			var errorMessage = '';
			if (hour.length >= 3) {
				if (hour.length > 5) {
					errorMessage = "You must input hour with format hh:mm like 11:05 as an example.";
				} else {
					var hourArray = hour.split(':');
					if (hourArray.length == 1) {
						errorMessage = "You must input hour with format hh:mm like 11:05 as an example.";
					} else {
						hourPart = hourArray[0];
						minutePart = hourArray[1];
						if (hourPart.length < 2 || minutePart.length < 2) {
							errorMessage = "You must input hour with format hh:mm like 11:05 as an example.";
						} else {
							if (hourPart > 12 || minutePart > 60) {
								if (hourPart > 12) {
									errorMessage = "You must input hour between 1 to 12.";
								}
								if (minutePart > 60) {
									errorMessage = "You must input minute between 1 to 60.";
								}
							} else {
								errorMessage = '';
								$scope.isAlreadySendToEveryOne = false;
								newPage.isAlreadySendToEveryOne = false;
								$scope.isAlreadySendToSupervisor = false;
								newPage.isAlreadySendToSupervisor = false;
							}
						}
					}
				}
			} else {
				errorMessage = "You must input hour with format hh:mm like 11:05 as an example.";
			}
			if (errorMessage.length > 0) {
				$scope.isAlreadySendToEveryOne = true;
				newPage.isAlreadySendToEveryOne = true;
				$scope.isAlreadySendToSupervisor = true;
				newPage.isAlreadySendToSupervisor = true;
			}
			$scope.hourError = errorMessage;
		}
	});
	
	$scope.sendEmailToEveryOne =function() {
		var part = $scope.part,
		hour = $scope.hour,
		hourArray = hour.split(':'),
		hourFilter = {hour: hourArray[0], minute: hourArray[1], part: part};
		todoService.sendMailToEveryOne(hourFilter, function(data, message) {
			$scope.isAlreadySendToEveryOne = true;
			newPage.isAlreadySendToEveryOne = true;
			console.log(message);
		});
	};
	
	$scope.pushMailToEveryOne =function() {
		todoService.pushMailToEveryOne(function(data, message) {
			$scope.isAlreadySendToEveryOne = true;
			newPage.isAlreadySendToEveryOne = true;
			console.log(message);
		});
	};
	
	$scope.sendEmailToSupervisor =function() {
		var part = $scope.part,
		hour = $scope.hour,
		hourArray = hour.split(':'),
		hourFilter = {hour: hourArray[0], minute: hourArray[1], part: part};
		todoService.sendMailToSupervisor(hourFilter, function(data, message) {
			$scope.isAlreadySendToSupervisor = true;
			newPage.isAlreadySendToSupervisor = true;
			console.log(message);
		});
	};
	
	$scope.pushMailToSupervisor =function() {
		todoService.pushMailToSupervisor(function(data, message) {
			$scope.isAlreadySendToSupervisor = true;
			newPage.isAlreadySendToSupervisor = true;
			console.log(message);
		});
	};
	
	pageService.setPage(newPage);
});
