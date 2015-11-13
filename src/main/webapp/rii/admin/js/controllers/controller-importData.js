/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Issue Report Controller
issueTrackerApp.controller("ImportDataController", function($scope, $timeout, pageService, issueService, contactService, categoryService, statusService, priorityService, partCustomerService, historicalProblemService, todoService, datePickerService, utilService, inputFileService) {
	var newPage = {
		isDetailPage : true,
		isNotDisplaySubPanelHeading : true,
		title : "Import Data from Excel to Data Store",
		isAlreadyLogin : pageService.getPage().isAlreadyLogin,
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	};
	
	$scope.isAlreadySendToEveryOne = newPage.isAlreadySendToEveryOne;
	$scope.isAlreadySendToSupervisor = newPage.isAlreadySendToSupervisor;
	
	$scope.data = {
			isDisabledIssue : true,
			isDisabledStatus : true,
			isDisabledContact : true,
			isDisabledCategory : true,
			isDisabledPriority : true,
			isDisabledUploadHP : true,
			isDisabledUpdateHP : true,
			isDisabledPartCustomer : true,
			isDisabledDefaultStatus : true,
			isDisabledDefaultPriority : true,
			isDisabledDefaultCategory : false
	};
	
	$scope.catPriStatusChoices = 'default';
	
	$scope.sendEmailToEveryOne =function() {
		todoService.sendMailToEveryOne(function(data, message) {
			$scope.isAlreadySendToEveryOne = true;
			newPage.isAlreadySendToEveryOne = true;
			console.log(message);
		});
	};
	
	$scope.sendEmailToSupervisor =function() {
		todoService.sendMailToSupervisor(function(data, message) {
			$scope.isAlreadySendToSupervisor = true;
			newPage.isAlreadySendToSupervisor = true;
			console.log(message);
		});
	};
	
	$scope.uploadDefaultCategories = function() {
		categoryService.uploadDefaultCategory(function(data, message) {
			$timeout(function() {
				$scope.data.isDisabledDefaultCategory = true;
				$scope.data.isDisabledDefaultPriority = false;
			});
		});
	};
	
	$scope.uploadDefaultPriorities = function() {
		priorityService.uploadDefaultPriority(function(data, message) {
			$timeout(function() {
				$scope.data.isDisabledDefaultPriority = true;
				$scope.data.isDisabledDefaultStatus = false;
			});
		});
	};
	
	$scope.uploadDefaultStatus = function() {
		statusService.uploadDefaultStatus(function(data, message) {
			$timeout(function() {
				$scope.data.isDisabledDefaultStatus = true;
				$scope.data.isDisabledContact = false;
			});
		});
	};
	
	$scope.uploadCategories = function() {
		var fileSelector = inputFileService.getSelectorById("fileCategory");
		inputFileService.loadFileDialog(fileSelector);
		
		inputFileService.addFileSelectedListener(fileSelector, function() {
			var files = this.files;
			
			if(files && files.length > 0) {
				var file = this.files[0],
				fileName = file.name,
				fileSize = parseInt(file.size / 1024),
				requestData = {
					fileId : 0,
					fileRequest : file,
					fileSize : file.size
				};
				console.log("Üpload file's size: " + fileSize + "KB");
				
				categoryService.uploadCategoryCsv(requestData, function(data, message) {
					$timeout(function() {
						$scope.data.isDisabledCategory = true;
						$scope.data.isDisabledPriority = false;
					});
				});
			}
			
			//clear input file after loading file dialog
			inputFileService.clearFileInput(this);
			
		});
	};
	
	$scope.uploadPriorities = function() {
		var fileSelector = inputFileService.getSelectorById("filePriority");
		inputFileService.loadFileDialog(fileSelector);
		
		inputFileService.addFileSelectedListener(fileSelector, function() {
			if(this.files && this.files.length > 0) {
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
					$timeout(function() {
						$scope.data.isDisabledPriority = true;
						$scope.data.isDisabledStatus = false;
					});
				});
			}
			
			//clear input file after loading file dialog
			inputFileService.clearFileInput(this);
			
		});
	};
	
	$scope.uploadStatus = function() {
		var fileSelector = inputFileService.getSelectorById("fileStatus");
		inputFileService.loadFileDialog(fileSelector);
		
		inputFileService.addFileSelectedListener(fileSelector, function() {
			if(this.files && this.files.length > 0) {
				var file = this.files[0],
				fileName = file.name,
				fileSize = parseInt(file.size / 1024),
				requestData = {
					fileId : 0,
					fileRequest : file,
					fileSize : file.size
				};
				console.log("Üpload file's size: " + fileSize + "KB");
				
				statusService.uploadStatusCsv(requestData, function(data, message) {
					$timeout(function() {
						$scope.data.isDisabledStatus = true;
						$scope.data.isDisabledContact = false;
					});
				});
			}
			
			//clear input file after loading file dialog
			inputFileService.clearFileInput(this);
			
		});
	};
	
	$scope.uploadContacts = function() {
		var fileSelector = inputFileService.getSelectorById("fileContact");
		inputFileService.loadFileDialog(fileSelector);
		
		inputFileService.addFileSelectedListener(fileSelector, function() {
			if(this.files && this.files.length > 0) {
				var file = this.files[0],
				fileName = file.name,
				fileSize = parseInt(file.size / 1024),
				requestData = {
					fileId : 0,
					fileRequest : file,
					fileSize : file.size
				};
				console.log("Üpload file's size: " + fileSize + "KB");
				
				if(fileName.indexOf("Contact") > -1) {
					contactService.uploadContactCsv(requestData, function(data, message) {
						$timeout(function() {//to refresh data binding
							$scope.data.isDisabledContact = true;
							$scope.data.isDisabledPartCustomer = false;
						});
					});
				}
				else{
					alert("Your file is not Contact Excel file!");
				}
			}
			
			//clear input file after loading file dialog
			inputFileService.clearFileInput(this);
			
		});
	};
	
	$scope.uploadPartsCustomers = function() {
		var fileSelector = inputFileService.getSelectorById("filePartCustomer");
		inputFileService.loadFileDialog(fileSelector);
		
		inputFileService.addFileSelectedListener(fileSelector, function() {
			if(this.files && this.files.length > 0) {
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
					$timeout(function() {
						$scope.data.isDisabledPartCustomer = true;
						$scope.data.isDisabledIssue = false;
					});
				});
			}
			
			//clear input file after loading file dialog
			inputFileService.clearFileInput(this);
			
		});
	};
	
	$scope.uploadIssues = function() {
		var fileSelector = inputFileService.getSelectorById("fileIssue");
		inputFileService.loadFileDialog(fileSelector);
		
		inputFileService.addFileSelectedListener(fileSelector, function() {
			if(this.files && this.files.length > 0) {
				var file = this.files[0],
				fileName = file.name,
				fileSize = parseInt(file.size / 1024),
				requestData = {
					fileId : 0,
					fileRequest : file,
					fileSize : file.size
				};
				console.log("Üpload file's size: " + fileSize + "KB");
				
				if(fileName.indexOf("Issue") > -1) {
					issueService.uploadIssueCsv(requestData, function(data, message) {
						$timeout(function() {
							$scope.data.isDisabledIssue = true;
							$scope.data.isDisabledUploadHP = false;
						});
					});
				}
				else{
					alert("Your file is not Issue Excel file!");
				}
				
			}
			
			//clear input file after loading file dialog
			inputFileService.clearFileInput(this);
			
		});
	};
	
	$scope.uploadHistoricalProblems = function() {
		var fileSelector = inputFileService.getSelectorById("fileHistoricalProblem");
		inputFileService.loadFileDialog(fileSelector);
		
		inputFileService.addFileSelectedListener(fileSelector, function() {
			if(this.files && this.files.length > 0) {
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
					$timeout(function() {
						$scope.data.isDisabledUploadHP = true;
						$scope.data.isDisabledUpdateHP = false;
					});
				});
			}
			
			//clear input file after loading file dialog
			inputFileService.clearFileInput(this);
			
		});
	};
	
	$scope.updateHistoricalProblems = function() {
		issueService.updateHistoricalProblem(function(data, message) {
			$timeout(function() {
				$scope.data.isDisabledUpdateHP = true;
			});
		});
	};
	
	pageService.setPage(newPage);
});
