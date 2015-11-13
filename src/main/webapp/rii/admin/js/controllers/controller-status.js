/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Status Controller
issueTrackerApp.controller("StatusController", function($scope, $modal, $log, $templateCache, pageService, statusService, inputFileService){
	var newPage = {
		isDetailPage : false,
		title : "Status List",
		createLabel : "New Status",
		createUrl : "status/newID",
		uploadLabel : "Click to upload Status",
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	loadStatusList = function(){
		//Show Animation
		$scope.$emit('LOADPAGE');
		
		//Pagination configure
		$scope.curPage = 0;
		$scope.pageSize = 200;
		$scope.statusItems = [];
		$scope.numberOfPages = function() {
			return 1;
		};
		
		statusService.loadStatusItems(function(statusItems, message){
			$scope.statusItems = statusItems;
			$scope.numberOfPages = function() {
				return Math.ceil($scope.statusItems.length / $scope.pageSize);
			};
			
			//Hide Animation
			$scope.$emit('UNLOADPAGE');
		});
	};
	
	//Init Data
	loadStatusList();
	
	//Upload Excel File
	var doNewAction = function(){
		//$templateCache.removeAll();//clear cache
		var fileSelector = inputFileService.getSelectorById("fileElement");
		inputFileService.loadFileDialog(fileSelector);
		
		inputFileService.addFileSelectedListener(fileSelector, function(){
			if(this.files && this.files.length > 0){
				var file = this.files[0],
				fileName = file.name,
				fileSize = parseInt(file.size / 1024),
				requestData = {
					fileId : 0,
					fileRequest : file,
					fileSize : file.size
				};
				console.log("Üpload file's size: " + fileSize + "KB");
				
				statusService.uploadStatusCsv(requestData, function(data, message){
					//console.log(data);
					//console.log(message);
					loadStatusList();
				});
			}
			
			//clear input file after loading file dialog
			inputFileService.clearFileInput(this);
			
		});
		
	};
	
	$scope.doDeleteStatus = function(index, size){
		var status = statusService.getStatusByIndex(index),
		item = {
				id : status.id,
				index : index,
				confirm : "status"
		},
		modalInstance = $modal.open({
			templateUrl : "view/modalDelete.html",
			controller : ModalDeleteStatusInstanceCtrl,
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
			$log.info('Modal for delete Status dismissed at: ' + new Date());
		});
		
		//statusService.deleteStatus(index, function(data, message){
			//alert(message);
		//});
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
	//$scope.status = statusService;
});

//Create Status Detail Controller
issueTrackerApp.controller("StatusDetailController", function($scope, $routeParams, $location, pageService, statusService, utilService){
	var statusId = utilService.getId($routeParams.statusId),
	status = {id : statusId},
	createLabel = "Save New Status",
	isUpdateStatus = false;
	
	//Get Status ID
	if(utilService.isNumber(statusId)){
		isUpdateStatus = true;
		createLabel = "Update Status";
	}
	
	if(isUpdateStatus){
		(function(){
			statusService.loadStatus(statusId, function(status, message){
				$scope.status = status;
			});
		})();//auto execute function
	}
	else{
		$scope.status = status;
	}
	
	var newPage = {
		isDetailPage : true,
		title : "Status Details",
		createLabel : createLabel,
		isDisplaySaveBtn : isUpdateStatus,
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	doNewAction = function(){
		var statusItems = statusService.getStatusItems(),
		newStatusId = statusItems.length + 1,
		newStatus = {
			id : isUpdateStatus ? statusId : newStatusId,
			name : $scope.status.name,
			description : $scope.status.description
		};
		
		if(isUpdateStatus){
			statusService.updateStatus(newStatus, function(data, message){
				alert(message);
				$location.path("/status");//redirect to status page
				//$location.reload();
			});
		}
		else{
			statusService.createStatus(newStatus, function(data, message){
				alert(message);
				$location.path("/status");
				//$location.reload();
			});
		}
	};
	
	//$scope.params = $routeParams;
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
	//$scope.status = statusService;
});

var ModalDeleteStatusInstanceCtrl = function($scope, $modalInstance, item, statusService) {

	$scope.item = item;

	$scope.ok = function() {
		statusService.deleteStatus(item.index, function(data, message){
			//alert(message);
			$modalInstance.close(item);
		});
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};