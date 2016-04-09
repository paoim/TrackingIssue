/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Priority Controller
issueTrackerApp.controller("PriorityController", function($scope, $modal, $log, $timeout, pageService, priorityService, inputFileService) {
	var newPage = {
		isDetailPage : false,
		title : "Priorities List",
		createLabel : "New Priority",
		createUrl : "setting/priorities/newID",
		uploadLabel : "Click to upload Priorities",
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	loadPriorityList = function() {
		//Show Animation
		$scope.$emit('LOADPAGE');
		
		//Pagination configure
		$scope.curPage = 0;
		$scope.pageSize = 200;
		$scope.priorities = [];
		$scope.numberOfPages = function() {
			return 1;
		};
		
		priorityService.loadPriorities(function(priorities, message) {
			$scope.priorities = priorities;
			$scope.numberOfPages = function() {
				return Math.ceil($scope.priorities.length / $scope.pageSize);
			};
			
			//Hide Animation
			$scope.$emit('UNLOADPAGE');
		});
	};
	
	//Init Data
	loadPriorityList();
	
	//Upload Excel File
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
					
					priorityService.uploadPriorityCsv(requestData, function(data, message) {
						//console.log(data);
						//console.log(message);
						loadPriorityList();
					});
				}
				
				//clear input file after loading file dialog
				inputFileService.clearFileInput(this);
			});
		}, 0, false);
	};
	
	$scope.doDeletePriority = function(index, size) {
		var priority = priorityService.getPriorityByIndex(index),
		item = {
			id : priority.id,
			index : index,
			confirm : "priority"
		},
		modalInstance = $modal.open({
			templateUrl : "view/modalDelete.html",
			controller : ModalDeletePriorityInstanceCtrl,
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
			$log.info('Modal for delete Priority dismissed at: ' + new Date());
		});
		
		//priorityService.deletePriority(index, function(data, message) {
			//alert(message);
		//});
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
	//$scope.priority = priorityService;
});

//Create Priority Detail Controller
issueTrackerApp.controller("PriorityDetailController", function($scope, $routeParams, $location, pageService, priorityService, utilService) {
	var priorityId = utilService.getId($routeParams.priorityId),
	priority = {id : priorityId},
	createLabel = "Save New Priority",
	isUpdatePriority = false;
	
	//Get Priority ID
	if (utilService.isNumber(priorityId)) {
		isUpdatePriority = true;
		createLabel = "Update Priority";
	}
	
	if (isUpdatePriority) {
		(function() {
			priorityService.loadPriority(priorityId, function(priority, message) {
				$scope.priority = priority;
			});
		})();//auto execute function
	} else {
		$scope.priority = priority;
	}
	
	//Override Main Controller
	var newPage = {
		isDetailPage : true,
		title : "Priority Details",
		createLabel : createLabel,
		isDisplaySaveBtn : isUpdatePriority,
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	doNewAction = function() {
		var priorities = priorityService.getPriorities(),
		newPriorityId = priorities.length + 1,
		newPriority = {
			id : isUpdatePriority ? priorityId : newPriorityId,
			name : $scope.priority.name,
			description : $scope.priority.description
		};
		
		if (isUpdatePriority) {
			priorityService.updatePriority(newPriority, function(data, message) {
				alert(message);
				$location.path("/setting/priorities");//redirect to priority page
				//$location.reload();
			});
		} else {
			priorityService.createPriority(newPriority, function(data, message) {
				alert(message);
				$location.path("/setting/priorities");
				//$location.reload();
			});
		}
	};
	
	//$scope.params = $routeParams;
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
	//$scope.priority = priorityService;
});

var ModalDeletePriorityInstanceCtrl = function($scope, $modalInstance, item, priorityService) {

	$scope.item = item;

	$scope.ok = function() {
		priorityService.deletePriority(item.index, function(data, message) {
			//alert(message);
			$modalInstance.close(item);
		});
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};
