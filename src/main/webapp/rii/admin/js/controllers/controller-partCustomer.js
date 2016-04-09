/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create PartCustomer Controller
issueTrackerApp.controller("PartCustomerController", function($scope, $modal, $log, $timeout, pageService, partCustomerService, inputFileService) {
	var newPage = {
		isDetailPage : false,
		title : "PartCustomers List",
		createLabel : "New PartCustomer",
		createUrl : "setting/partCustomers/newID",
		uploadLabel : "Click to upload PartCustomers",
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	loadPartCustomerList = function() {
		//Show Animation
		$scope.$emit('LOADPAGE');
		
		//Pagination configure
		$scope.curPage = 0;
		$scope.pageSize = 200;
		$scope.partCustomers = [];
		$scope.numberOfPages = function() {
			return 1;
		};
		
		partCustomerService.loadPartCustomers(function(partCustomers, message) {
			$scope.partCustomers = partCustomers;
			$scope.numberOfPages = function() {
				return Math.ceil($scope.partCustomers.length / $scope.pageSize);
			};
			
			//Hide Animation
			$scope.$emit('UNLOADPAGE');
		});
	};
	
	//Init Data
	loadPartCustomerList();
	
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
					
					partCustomerService.uploadPartCustomerCsv(requestData, function(data, message) {
						//console.log(data);
						//console.log(message);
						loadPartCustomerList();
					});
				}
				
				//clear input file after loading file dialog
				inputFileService.clearFileInput(this);
			});
		}, 0, false);
	};
	
	$scope.doDeletePartCustomer = function(id, size) {
		var item = {
			id : id,
			confirm : "partCustomer"
		},
		modalInstance = $modal.open({
			templateUrl : "view/modalDelete.html",
			controller : ModalDeletePartCustomerInstanceCtrl,
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
			$log.info('Modal for delete PartCustomer dismissed at: ' + new Date());
		});
		
		//partCustomerService.deletePartCustomer(id, function(data, message) {
			//alert(message);
		//});
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
	//$scope.partCustomer = partCustomerService;
});

//Create PartCustomer Detail Controller
issueTrackerApp.controller("PartCustomerDetailController", function($scope, $routeParams, $location, pageService, partCustomerService, utilService) {
	var partCustomerId = utilService.getId($routeParams.partCustomerId),
	partCustomer = {id : partCustomerId},
	createLabel = "Save New",
	isUpdatePartCustomer = false;
	
	//Get PartCustomer ID
	if (utilService.isNumber(partCustomerId)) {
		isUpdatePartCustomer = true;
		createLabel = "Update PartCustomer";
	}
	
	if (isUpdatePartCustomer) {
		(function() {
			partCustomerService.loadPartCustomer(partCustomerId, function(partCustomer, message) {
				$scope.partCustomer = partCustomer;
			});
		})();//auto execute function
	} else {
		$scope.partCustomer = partCustomer;
	}
	
	var newPage = {
		isDetailPage : true,
		title : "PartCustomer Details",
		createLabel : createLabel,
		isDisplaySaveBtn : isUpdatePartCustomer,
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	doNewAction = function() {
		var partCustomers = partCustomerService.getPartCustomers(),
		newPartCustomerId = partCustomers.length + 1,
		newPartCustomer = {
			id : isUpdatePartCustomer ? partCustomerId : newPartCustomerId,
			custNum : $scope.partCustomer.custNum,
			custName : $scope.partCustomer.custName,
			custId : $scope.partCustomer.custId,
			partNum : $scope.partCustomer.partNum,
			partDescription : $scope.partCustomer.partDescription
		};
		
		if (isUpdatePartCustomer) {
			partCustomerService.updatePartCustomer(newPartCustomer, function(data, message) {
				alert(message);
				$location.path("/setting/partCustomers");//redirect to partCustomers page
				//$location.reload();
			});
		} else {
			partCustomerService.createPartCustomer(newPartCustomer, function(data, message) {
				alert(message);
				$location.path("/setting/partCustomers");
				//$location.reload();
			});
		}
	};
	
	//$scope.params = $routeParams;
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
	//$scope.partCustomer = partCustomerService;
});

var ModalDeletePartCustomerInstanceCtrl = function($scope, $modalInstance, item, partCustomerService) {

	$scope.item = item;

	$scope.ok = function() {
		partCustomerService.deletePartCustomer(item.id, function(data, message) {
			//alert(message);
			$modalInstance.close(item);
		});
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};
