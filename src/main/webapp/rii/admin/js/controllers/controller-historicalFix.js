/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create historicalFix Controller
issueTrackerApp.controller("historicalFixController", function($scope, $modal, $log, $templateCache, $filter, pageService, issueService, historicalFixService, inputFileService, utilService) {
	var newPage = {
		isDetailPage : false,
		title : "Historical Fixes List",
		createLabel : "New Historical Fix",
		createUrl : "setting/historicalFixes/newID",
		uploadLabel : "Click to upload Historical Fixes",
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	loadHistoricalFixList = function() {
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
		$scope.historicalFixes = [];
		$scope.numberOfPages = function() {
			return 1;
		};
		
		// Get all issues with historicalFixes
		issueService.quickPartReport(issueFilter, function(issues, message) {
			angular.forEach(issues, function(issue) {
				angular.forEach(issue.historicalFixes, function(historicalFix) {
					$scope.historicalFixes.push(historicalFix);
				});
			});
			
			var newHistoricalFixes = utilService.removeDuplicateArrayByID($scope.historicalFixes);
			$scope.historicalFixes = newHistoricalFixes;
			$scope.numberOfPages = function() {
				return ($scope.historicalFixes.length == 0 ? 1 : Math.ceil($scope.historicalFixes.length / $scope.pageSize));
			};
			
			//Hide Animation
			$scope.$emit('UNLOADPAGE');
		});
	};
	
	//Init Data
	loadHistoricalFixList();
	
	//init searchHF for search form
	$scope.searchHF = {};
	
	//Check input Data, search & reset button will enable when input data
	var checkSearchInput = function(inputData) {
		var isAvailableSearch = true;
		if (inputData) {
			isAvailableSearch = false;
		}
		
		$scope.availableSearchHF = isAvailableSearch;
	}
	checkSearchInput();//init method to disable both search & reset button
	
	// open search form label
	$scope.openSearchFormLabel = "Open Search Form";
	
	$scope.compareDates = function() {
		var isAvailableSearch = true,
		searchHF = $scope.searchHF;
		
		if (searchHF && searchHF.startDate && searchHF.endDate) {
			//console.log(searchHF);
			isAvailableSearch = false;
			
			if (searchHF.startDate > searchHF.endDate) {
				isAvailableSearch = true;
				
				alert("Start Date must be smaller than End Date.");
				$scope.searchHF.endDate = "";
				$scope.searchHF.startDate = "";
			}
			
		}
		
		$scope.availableSearchHF = isAvailableSearch;
	};
	
	// load auto completion data
	$scope.issueList = [];
	$scope.$watch("searchHF.issueID", function(issueID) {
		if (issueID && issueID.length >= 1) {
			historicalFixService.loadIssueHF(issueID, function(items, message) {
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
	$scope.$watch("searchHF.partNum", function(partNum) {
		if (partNum && partNum.length >= 2) {
			historicalFixService.loadPartNumHF(partNum, function(items, message) {
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
	$scope.doSearchHF = function() {
		var searchHF = $scope.searchHF;
		
		if (searchHF) {
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
			
			if (searchHF.issueID || searchHF.partNum) {
				var hfFilter = {isDefault : 0};
				if (searchHF.issueID) {
					hfFilter.issueId = searchHF.issueID;
				}
				
				if (searchHF.partNum) {
					hfFilter.partNum = searchHF.partNum;
				}
				
				historicalFixService.loadHFReport(hfFilter, function(historicalFixes, message) {
					$scope.historicalFixes = historicalFixes;
					$scope.numberOfPages = function() {
						return ($scope.historicalFixes.length == 0 ? 1 : Math.ceil($scope.historicalFixes.length / $scope.pageSize));
					};
					
					//Hide Animation
					$scope.$emit('UNLOADSEARCH');
				});
			} else {
				if (searchHF.startDate && searchHF.endDate) {
					var startDate = searchHF.startDate,
					endDate = searchHF.endDate;
					
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
					
					// Get all issues with historicalFixes
					issueService.quickPartReport(issueFilter, function(issues, message) {
						angular.forEach(issues, function(issue) {
							angular.forEach(issue.historicalFixes, function(historicalFix) {
								$scope.historicalFixes.push(historicalFix);
							});
						});
						
						var newHistoricalFixes = utilService.removeDuplicateArrayByID($scope.historicalFixes);
						$scope.historicalFixes = newHistoricalFixes;
						$scope.numberOfPages = function() {
							return ($scope.historicalFixes.length == 0 ? 1 : Math.ceil($scope.historicalFixes.length / $scope.pageSize));
						};
						
						//Hide Animation
						$scope.$emit('UNLOADSEARCH');
					});
				}
			}
		}
	};
	
	// Reset Button
	$scope.resetSearchHF = function() {
		$scope.searchHF = {};// clear form
		
		checkSearchInput();
	};
	
	//Upload Excel file
	var doNewAction = function() {
		//$templateCache.removeAll();//clear cache
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
				
				historicalFixService.uploadHistoricalFixCsv(requestData, function(data, message) {
					//console.log(data);
					//console.log(message);
					loadHistoricalFixList();
				});
			}
			
			//clear input file after loading file dialog
			inputFileService.clearFileInput(this);
			
		});
		
	};
	
	$scope.doDeleteHistoricalFix = function(id, size) {
		//var historicalFix = historicalFixService.getHistoricalProblemByIndex(index),
		item = {
			id : id,
			//index : index,
			confirm : "Historical Fix"
		},
		modalInstance = $modal.open({
			templateUrl : "view/modalDelete.html",
			controller : ModaldeleteHistoricalFixInstanceCtrl,
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
			$log.info('Modal for delete Historical Fix dismissed at: ' + new Date());
		});
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
});


//Create historicalFix Detail Controller
issueTrackerApp.controller("historicalFixDetailController", function($scope, $routeParams, $location, pageService, issueService, historicalFixService, utilService) {
	var historicalFixId = utilService.getId($routeParams.historicalFixId),
	historicalFix = {id : historicalFixId},
	createLabel = "Save Historical Fix",
	isupdateHistoricalFix = false;
	
	//Get historicalFix ID
	if (utilService.isNumber(historicalFixId)) {
		isupdateHistoricalFix = true;
		createLabel = "Update Historical Fix";
	}
	
	if (isupdateHistoricalFix) {
		(function() {
			historicalFixService.loadHistoricalFix(historicalFixId, function(historicalFix, message) {
				$scope.historicalFix = historicalFix;
			});
		})();//auto execute function
	} else {
		$scope.historicalFix = historicalFix;
	}
	
	// load auto completion data
	/*$scope.partNumList = [];
	$scope.$watch("historicalFix.partNum", function(partNum) {
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
		isPartNum : false,
		isDetailPage : true,
		createLabel : createLabel,
		title : "Historical Fix Detail",
		isDisplaySaveBtn : isupdateHistoricalFix,
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	doNewAction = function() {
		var historicalFixes = historicalFixService.getHistoricalFixes(),
		newHistoricalFixId = historicalFixes.length + 1,
		newHistoricalFix = {
			id : isupdateHistoricalFix ? historicalFixId : newHistoricalFixId,
			issueID : $scope.historicalFix.issueID,
			partNum : $scope.historicalFix.partNum,
			versionFix : $scope.historicalFix.versionFix
		};
		
		// Get PartNum By Issue ID
		issueService.getPartNum(newHistoricalFix.issueID, function(issue, message) {
			newHistoricalFix.partNum = issue.partNum;
			console.log(newHistoricalFix);
			
			if (isupdateHistoricalFix) {
				historicalFixService.updateHistoricalFix(newHistoricalFix, function(data, message) {
					alert(message);
					$location.path("/setting/historicalFixes");//redirect to historicalFixes page
					//$location.reload();
				});
			} else {
				historicalFixService.createHistoricalFix(newHistoricalFix, function(data, message) {
					alert(message);
					$location.path("/setting/historicalFixes");
					//$location.reload();
				});
			}
		});
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
});

var ModaldeleteHistoricalFixInstanceCtrl = function($scope, $modalInstance, item, historicalFixService) {

	$scope.item = item;

	$scope.ok = function() {
		historicalFixService.deleteHistoricalFix(item.id, function(data, message) {
			//alert(message);
			$modalInstance.close(item);
		});
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};
