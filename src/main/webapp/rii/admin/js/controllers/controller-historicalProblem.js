/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create historicalProblem Controller
issueTrackerApp.controller("historicalProblemController", function($scope, $modal, $log, $timeout, $filter, pageService, issueService, historicalProblemService, inputFileService, utilService) {
	var newPage = {
		isDetailPage : false,
		title : "Historical Problems List",
		createLabel : "New Historical Problem",
		createUrl : "setting/historicalProblems/newID",
		uploadLabel : "Click to upload Historical Problems",
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	loadHistoricalProblemList = function() {
		//Show Animation
		$scope.$emit('LOADPAGE');
		
		var today = new Date(),
		endDate = utilService.addDays(today, 1),//current month and tomorrow
		startDate = utilService.minusDateMonth(today, 1);//last month
		
		endDate = $filter('date')(endDate, 'yyyy-MM-dd');
		startDate = $filter('date')(startDate, 'yyyy-MM-dd');
		//console.log("startDate: " + startDate + " with endDate: " + endDate);
		
		var issueFilter = {
				status : 1,
				isDefault : 0,
				startDate : startDate,
				endDate : endDate
		};
		
		//Pagination configure
		$scope.curPage = 0;
		$scope.pageSize = 200;
		$scope.historicalProblems = [];
		$scope.numberOfPages = function() {
			return 1;
		};
		
		// Get all issues with historicalProblems
		issueService.quickPartReport(issueFilter, function(issues, message) {
			angular.forEach(issues, function(issue) {
				angular.forEach(issue.historicalProblems, function(historicalProblem) {
					$scope.historicalProblems.push(historicalProblem);
				});
			});
			
			var newHistoricalProblems = utilService.removeDuplicateArrayByID($scope.historicalProblems);
			$scope.historicalProblems = newHistoricalProblems;
			$scope.numberOfPages = function() {
				return ($scope.historicalProblems.length == 0 ? 1 : Math.ceil($scope.historicalProblems.length / $scope.pageSize));
			};
			
			//Hide Animation
			$scope.$emit('UNLOADPAGE');
		});
	};
	
	//Init Data
	loadHistoricalProblemList();
	
	//init searchHP for search form
	$scope.searchHP = {};
	
	// open search form label
	$scope.openSearchFormLabel = "Open Search Form";
	
	$scope.compareDates = function() {
		var isAvailableSearch = true,
		searchHP = $scope.searchHP;
		
		if (searchHP && searchHP.startDate && searchHP.endDate) {
			//console.log(searchHP);
			isAvailableSearch = false;
			
			if (searchHP.startDate > searchHP.endDate) {
				isAvailableSearch = true;
				
				alert("Start Date must be smaller than End Date.");
				$scope.searchHP.endDate = "";
				$scope.searchHP.startDate = "";
			}
			
		}
		
		$scope.availableSearchHP = isAvailableSearch;
	};
	
	//Check input Data, search & reset button will enable when input data
	var checkSearchInput = function(inputData) {
		var isAvailableSearch = true;
		if (inputData) {
			isAvailableSearch = false;
		}
		
		$scope.availableSearchHP = isAvailableSearch;
	}
	checkSearchInput();//init method to disable both search & reset button
	
	// load auto completion data
	$scope.issueList = [];
	$scope.$watch("searchHP.issueID", function(issueID) {
		if (issueID && issueID.length >= 1) {
			historicalProblemService.loadIssueHP(issueID, function(items, message) {
				$scope.issueList.length = 0;
				angular.forEach(items, function(item) {
					$scope.issueList.push(item.partNum);
				});
				
				if ($scope.issueList.length > 0) {
					var newIssueList = utilService.removeDuplicateList($scope.issueList);
					$scope.issueList = newIssueList;
				}
			});
		}
		checkSearchInput(issueID);
	});
	
	$scope.partNumList = [];
	$scope.$watch("searchHP.partNum", function(partNum) {
		if (partNum && partNum.length >= 2) {
			historicalProblemService.loadPartNumHP(partNum, function(items, message) {
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
		checkSearchInput(partNum);
	});
	
	//Open Search Form button
	$scope.openSearchForm = function() {
		$scope.isOpenSearchForm = !$scope.isOpenSearchForm;
		var label = "Open Search Form";
		if ($scope.isOpenSearchForm) {
			label = "Close Search Form";
		}
		$scope.openSearchFormLabel = label;
	};
	
	// Search Button
	$scope.doSearchHP = function() {
		var searchHP = $scope.searchHP;
		
		if (searchHP) {
			// Close Search Form
			$scope.isOpenSearchForm = false;
			$scope.openSearchFormLabel = "Open Search Form";
			
			//Show Animation
			$scope.$emit('LOADSEARCH');
			
			//Pagination configure
			$scope.curPage = 0;
			$scope.pageSize = 200;
			$scope.historicalProblems = [];
			$scope.numberOfPages = function() {
				return 1;
			};
			
			if (searchHP.issueID || searchHP.partNum) {
				var hpFilter = {isDefault : 0};
				if (searchHP.issueID) {
					hpFilter.issueId = searchHP.issueID;
				}
				
				if (searchHP.partNum) {
					hpFilter.partNum = searchHP.partNum;
				}
				
				historicalProblemService.loadHPReport(hpFilter, function(historicalProblems, message) {
					$scope.historicalProblems = historicalProblems;
					$scope.numberOfPages = function() {
						return ($scope.historicalProblems.length == 0 ? 1 : Math.ceil($scope.historicalProblems.length / $scope.pageSize));
					};
					
					//Hide Animation
					$scope.$emit('UNLOADSEARCH');
				});
			} else {
				if (searchHP.startDate && searchHP.endDate) {
					var startDate = searchHP.startDate,
					endDate = searchHP.endDate;
					
					//Add one day if equal date
					if (utilService.getStrDateDDMMYYYY(startDate) == utilService.getStrDateDDMMYYYY(endDate)) {
						endDate = utilService.addDays(startDate, 1);
					}
					
					endDate = $filter('date')(endDate, 'yyyy-MM-dd');
					startDate = $filter('date')(startDate, 'yyyy-MM-dd');
					//console.log("startDate: " + startDate + " with endDate: " + endDate);
					
					var issueFilter = {
							status : 1,
							isDefault : 0,
							startDate : startDate,
							endDate : endDate
					};
					
					// Get all issues with historicalProblems
					issueService.quickPartReport(issueFilter, function(issues, message) {
						angular.forEach(issues, function(issue) {
							angular.forEach(issue.historicalProblems, function(historicalProblem) {
								$scope.historicalProblems.push(historicalProblem);
							});
						});
						
						var newHistoricalProblems = utilService.removeDuplicateArrayByID($scope.historicalProblems);
						$scope.historicalProblems = newHistoricalProblems;
						$scope.numberOfPages = function() {
							return ($scope.historicalProblems.length == 0 ? 1 : Math.ceil($scope.historicalProblems.length / $scope.pageSize));
						};
						
						//Hide Animation
						$scope.$emit('UNLOADSEARCH');
					});
				}
			}
		}
	};
	
	// Reset Button
	$scope.resetSearchHP = function() {
		$scope.searchHP = {};// clear form
		
		checkSearchInput();
	};
	
	//Upload Excel file
	var doNewAction = function() {
		$timeout(function() {
			var fileSelector = inputFileService.getSelectorById("fileElement");
			inputFileService.loadFileDialog(fileSelector);
			
			inputFileService.addFileSelectedListener(fileSelector, function() {
				if (this.files && this.files.length > 0) {
					var file = this.files[0],
					fileName = file.name,
					fileSize = parseInt(file.size / 1024),
					requestData = {
						fileId : 0,
						fileRequest : file,
						fileSize : file.size
					};
					console.log("Üpload file's size: " + fileSize + "KB");
					
					historicalProblemService.uploadHistoricalProblemCsv(requestData, function(data, message) {
						//console.log(data);
						//console.log(message);
						loadHistoricalProblemList();
					});
				}
				
				//clear input file after loading file dialog
				inputFileService.clearFileInput(this);
			});
		}, 0, false);
	};
	
	$scope.doDeleteHistoricalProblem = function(id, size) {
		//var historicalProblem = historicalProblemService.getHistoricalProblemByIndex(index),
		item = {
			id : id,
			//index : index,
			confirm : "Historical Problem"
		},
		modalInstance = $modal.open({
			templateUrl : "view/modalDelete.html",
			controller : ModaldeleteHistoricalProblemInstanceCtrl,
			size : size,
			resolve : {
				item : function() {
					return item;
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			$scope.selected = selectedItem;
		}, function() {
			$log.info('Modal for delete Historical Problem dismissed at: ' + new Date());
		});
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
	//$scope.historicalProblem = historicalProblemService;
});

//Create historicalProblem Detail Controller
issueTrackerApp.controller("historicalProblemDetailController", function($scope, $routeParams, $location, pageService, issueService, historicalProblemService, utilService) {
	var historicalProblemId = utilService.getId($routeParams.historicalProblemId),
	historicalProblem = {id : historicalProblemId},
	createLabel = "Save Historical Problem",
	isupdateHistoricalProblem = false;
	
	//Get historicalProblem ID
	if (utilService.isNumber(historicalProblemId)) {
		isupdateHistoricalProblem = true;
		createLabel = "Update Historical Problem";
	}
	
	if (isupdateHistoricalProblem) {
		(function() {
			historicalProblemService.loadHistoricalProblem(historicalProblemId, function(historicalProblem, message) {
				$scope.historicalProblem = historicalProblem;
			});
		})();//auto execute function
	}
	else {
		$scope.historicalProblem = historicalProblem;
	}
	
	// load auto completion data
	/*$scope.partNumList = [];
	$scope.$watch("historicalProblem.partNum", function(partNum) {
		if (partNum && partNum.length > 3) {
			var query = "PartNum like '" + partNum + "%'";
			issueService.searchPartNum(encodeURI(query), function(items) {
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
	});*/
	
	var newPage = {
		isDetailPage : true,
		createLabel : createLabel,
		title : "Historical Problem Detail",
		isDisplaySaveBtn : isupdateHistoricalProblem,
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	doNewAction = function() {
		var historicalProblems = historicalProblemService.getHistoricalProblems(),
		newHistoricalProblemId = historicalProblems.length + 1,
		newHistoricalProblem = {
			id : isupdateHistoricalProblem ? historicalProblemId : newHistoricalProblemId,
			issueID : $scope.historicalProblem.issueID,
			partNum : $scope.historicalProblem.partNum,
			versionProblem : $scope.historicalProblem.versionProblem
		};
		
		// Get PartNum By Issue ID
		issueService.getPartNum(newHistoricalProblem.issueID, function(issue, message) {
			newHistoricalProblem.partNum = issue.partNum;
			console.log(newHistoricalProblem);
			
			if (isupdateHistoricalProblem) {
				historicalProblemService.updateHistoricalProblem(newHistoricalProblem, function(data, message) {
					alert(message);
					$location.path("/setting/historicalProblems");//redirect to historicalProblems page
					//$location.reload();
				});
			} else {
				historicalProblemService.createHistoricalProblem(newHistoricalProblem, function(data, message) {
					alert(message);
					$location.path("/setting/historicalProblems");
					//$location.reload();
				});
			}
		});
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
});

var ModaldeleteHistoricalProblemInstanceCtrl = function($scope, $modalInstance, item, historicalProblemService) {

	$scope.item = item;

	$scope.ok = function() {
		historicalProblemService.deleteHistoricalProblem(item.id, function(data, message) {
			//alert(message);
			$modalInstance.close(item);
		});
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};