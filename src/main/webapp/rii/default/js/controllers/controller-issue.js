/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
** Create Date: 07/11/2014
*********************************************/
// Create Issues Controller
issueTrackerApp.controller("IssuesController", function($scope, $modal, $log, $templateCache, $filter, pageService, issueService, contactService, statusService, inputFileService, utilService) {
	var newPage = {
		isDetailPage : false,
		title : "Issues List",
		isLinkReportPage : true,
		isUploadExcelFile : false,//flag to show or hide upload button
		createLabel : "New Issue",
		createUrl : "issues/issue/view/newID",
		uploadLabel : "Click to upload Issues",
		reportLabel : "Generate Issue Report",
		reportUrl : "report/issues"
	},
	loadIssueList = function() {
		//Pagination configure
		$scope.curPage = 0;
		$scope.pageSize = 200;
		
		var storeIssues = pageService.getPage().storeIssues || [];
		if (storeIssues.length > 0) {
			$scope.issuesList = storeIssues;
			$scope.numberOfPages = function() {
				return ($scope.issuesList.length == 0 ? 1 : Math.ceil($scope.issuesList.length / $scope.pageSize));
			};
			
			//Keep to store issues
			newPage.storeIssues = storeIssues || [];
		} else {
			var today = new Date(),
			endDate = utilService.addDays(today, 1),//current month and tomorrow
			startDate = utilService.minusDateMonth(today, 1);//last month
			
			//Show Animation
			$scope.$emit('LOADPAGE');
			
			$scope.issuesList = [];
			$scope.numberOfPages = function() {
				return 1;
			};
			
			endDate = $filter('date')(endDate, 'yyyy-MM-dd');
			startDate = $filter('date')(startDate, 'yyyy-MM-dd');
			//console.log("startDate: " + startDate + " with endDate: " + endDate);
			
			var issueFilter = {
					status : 1,
					isDefault : 0,
					startDate : startDate,
					endDate : endDate
			};
			
			//encodeURI(query)
			issueService.quickPartReport(issueFilter, function(issuesList, message) {
				if (issuesList.length > 0) {
					$scope.issuesList = issuesList;
					$scope.numberOfPages = function() {
						return ($scope.issuesList.length == 0 ? 1 : Math.ceil($scope.issuesList.length / $scope.pageSize));
					};
					
					//Keep to store issues
					newPage.storeIssues = issuesList || [];
					
					//Hide Animation
					$scope.$emit('UNLOADPAGE');
				} else {
					//Re-Load Active Status
					issueFilter = {
							status : 1,
							isDefault : 0
					};
					issueService.quickPartReport(issueFilter, function(issuesList, message) {
						$scope.issuesList = issuesList;
						$scope.numberOfPages = function() {
							return ($scope.issuesList.length == 0 ? 1 : Math.ceil($scope.issuesList.length / $scope.pageSize));
						};
						
						//Keep to store issues
						newPage.storeIssues = issuesList || [];
						
						//Hide Animation
						$scope.$emit('UNLOADPAGE');
					});
				}
			});
		}
	};
	
	//Init Data
	loadIssueList();
	
	(function() {
		contactService.loadContacts(function(contacts, message) {
			var contactItems = [{}];
			for(var i = 0; i < contacts.length; i++) {
				var name = "",
				contact = contacts[i];
				
				if (contact.firstName) {
					name = contact.firstName + ' ';
				}
				if (contact.lastName) {
					name = name + contact.lastName;
				}
				
				var contactItem = {id : contact.id, name : name};
				contactItems.push(contactItem);
			}
			
			$scope.contactItems = contactItems;
		});
		
	})();
	
	(function() {
		statusService.loadStatusItems(function(statusItems, message) {
			$scope.statusItems = statusItems;
		});
	})();
	
	//init searchIssue for search form
	$scope.searchIssue = {};
	
	$scope.compareDates = function() {
		var isAvailableSearch = true,
		searchIssue = $scope.searchIssue;
		
		if (searchIssue && searchIssue.startDate && searchIssue.endDate) {
			isAvailableSearch = false;
			
			if (searchIssue.startDate > searchIssue.endDate) {
				isAvailableSearch = true;
				
				alert("Start Date must be smaller than End Date.");
				$scope.searchIssue.endDate = "";
				$scope.searchIssue.startDate = "";
			}
			
		}
		
		$scope.availableSearchIssue = isAvailableSearch;
	};
	
	// Any function returning a promise object can be used to load values asynchronously
	$scope.getPartNum = function(partNum) {
		var query = "PartNum like '" + partNum + "%'";
		//Start searching partNum when it has more than 2 characters
		if (partNum.length >= 3) {
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
	
	//Check input Data, search & reset button will enable when input data
	var checkSearchInput = function(inputData) {
		var isAvailableSearch= true;
		if (inputData) {
			isAvailableSearch= false;
		}
		
		$scope.availableSearchIssue = isAvailableSearch;
	}
	checkSearchInput();//init method to disable both search & reset button
	
	$scope.$watch('searchIssue.partNum', function(partNum) {
		checkSearchInput(partNum);
	});
	
	$scope.$watch('searchIssue.openedBy', function(openedBy) {
		checkSearchInput(openedBy);
	});
	
	$scope.$watch('searchIssue.assignedTo', function(assignedTo) {
		checkSearchInput(assignedTo);
	});
	
	$scope.$watch('searchIssue.status', function(status) {
		checkSearchInput(status);
	});
	
	// open search form label
	$scope.openSearchFormLabel = "Open Search Form";
	$scope.openCurrentFilterLabel = "Open Filter Form";
	
	//Open Search Form button
	$scope.openSearchForm = function() {
		if ($scope.isOpenFilterForm) {
			$scope.isOpenFilterForm = false;
			$scope.openCurrentFilterLabel = "Open Filter Form";
		}
		
		$scope.isOpenSearchForm = !$scope.isOpenSearchForm;
		var label = "Open Search Form";
		if ($scope.isOpenSearchForm) {
			label = "Close Search Form";
		}
		$scope.openSearchFormLabel = label;
	};
	
	//Open Filter Form Button
	$scope.openFilterForm = function() {
		if ($scope.isOpenSearchForm) {
			$scope.isOpenSearchForm = false;
			$scope.openSearchFormLabel = "Open Search Form";
		}
		
		$scope.isOpenFilterForm = !$scope.isOpenFilterForm;
		var label = "Open Filter Form";
		if ($scope.isOpenFilterForm) {
			label = "Close Filter Form";
		}
		$scope.openCurrentFilterLabel = label;
	};
	
	// Search Button
	$scope.doSearchIssue = function() {
		var searchIssue = $scope.searchIssue,
		issueFilter = {isDefault : 0};
		
		if (searchIssue) {
			// Close Search Form
			$scope.isOpenSearchForm = false;
			$scope.openSearchFormLabel = "Open Search Form";
			
			//Show Animation
			$scope.$emit('LOADSEARCH');
			
			if (searchIssue.startDate && searchIssue.endDate) {
				var startDate = searchIssue.startDate,
				endDate = searchIssue.endDate;
				
				//Add one day if equal date
				if (utilService.getStrDateDDMMYYYY(startDate) == utilService.getStrDateDDMMYYYY(endDate)) {
					endDate = utilService.addDays(startDate, 1);
				}
				
				endDate = $filter('date')(endDate, 'yyyy-MM-dd');
				startDate = $filter('date')(startDate, 'yyyy-MM-dd');
				issueFilter.endDate = endDate;
				issueFilter.startDate = startDate;
			}
			if (searchIssue.partNum) {
				issueFilter.partNum = searchIssue.partNum;
			}
			if (searchIssue.openedBy) {
				issueFilter.opendBy = searchIssue.openedBy.id;
			}
			if (searchIssue.assignedTo) {
				issueFilter.assignedTo = searchIssue.assignedTo.id;
			}
			if (searchIssue.status) {
				issueFilter.status = searchIssue.status.id;
			}
			
			//Pagination configure
			$scope.curPage = 0;
			$scope.pageSize = 200;
			$scope.issuesList = [];
			$scope.numberOfPages = function() {
				return 1;
			};
			
			//encodeURI(query)
			issueService.quickPartReport(issueFilter, function(issuesList, message) {
				$scope.issuesList = issuesList;
				$scope.numberOfPages = function() {
					return ($scope.issuesList.length == 0 ? 1 : Math.ceil($scope.issuesList.length / $scope.pageSize));
				};
				
				//Keep to store issues
				newPage.storeIssues = issuesList || [];
				
				//Hide Animation
				$scope.$emit('UNLOADSEARCH');
			});
		}
	};
	
	$scope.resetSearchIssue = function() {
		$scope.searchIssue = {};// clear form
		
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
				//console.log("Üpload file's size: " + fileSize + "KB");
				
				if (fileName.indexOf("Issue") > -1) {
					issueService.uploadIssueCsv(requestData, function(data, message) {
						//console.log(data);
						//console.log(message);
						loadIssueList();
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
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
});

//Create Issue Detail Controller
issueTrackerApp.controller("IssueDetailController", function($scope, $routeParams, $location, $modal, $log, pageService, utilService, issueService, photoService, contactService, priorityService, statusService, categoryService, datePickerService, inputFileService) {
	var isUpdateIssue = false,
	createLabel = "Save Issue",
	issues = issueService.getIssues(),
	contacts = contactService.getContacts(),
	priorities = priorityService.getPriorities(),
	statusItems = statusService.getStatusItems(),
	categories = categoryService.getCategories(),
	issueId = utilService.getId($routeParams.issueId),
	issue = {id : issueId};
	
	//Get Issue by ID
	if (utilService.isNumber(issueId)) {
		isUpdateIssue = true;
		createLabel = "Update Issue";
	}
	
	//Date Picker
	$scope.initDatePicker = function() {
		var date_add = datePickerService.getDateAdd(10),
		date_minus = datePickerService.getDateMinus(10);
		
		$scope.minDueDate = $scope.minDueDate ? null : date_minus;
		$scope.minOpenedDate = $scope.minOpenedDate ? null : date_minus;
		$scope.minDateFollowUntil = $scope.minDateFollowUntil ? null : date_minus;
		$scope.maxDueDate = $scope.maxDueDate ? null : date_add;
		$scope.maxOpenedDate = $scope.maxOpenedDate ? null : date_add;
		$scope.maxDateFollowUntil = $scope.maxDateFollowUntil ? null : date_add;
	};
	$scope.initDatePicker();
	
	var eventHandler = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
	};
	$scope.openDueDate = function($event) {
		eventHandler($event);
		
		$scope.openedDueDate = true;
	};
	$scope.openOpenedDate = function($event) {
		eventHandler($event);
		
		$scope.openedOpenedDate = true;
	};
	$scope.openFollowUntil = function($event) {
		eventHandler($event);
		
		$scope.openedFollowUntil = true;
	};
	
	//Upload Image
	$scope.imageSource = "";
	$scope.isNewUploadImage = true;
	$scope.openFileDialog = function() {
		var fileSelector = inputFileService.getSelectorById("issueAttachment");
		inputFileService.loadFileDialog(fileSelector);
		
		inputFileService.addFileSelectedListener(fileSelector, function() {
			$scope.isNewUploadImage = false;
			var files = this.files,
			photoId = ($scope.issue.attachment ? $scope.issue.attachment : 0);
			
			if (files && files.length > 0) {
				var file = files[0],
				fileName = file.name,
				fileSize = parseInt(file.size / 1024),
				requestData = {
					fileId : photoId,
					fileRequest : file,
					fileSize : file.size
				};
				//console.log("Üpload file's size: " + fileSize + "KB");
				
				//check to make sure it is not the same file's name
				if (!(fileName === $scope.issueAttachmentName)) {
					photoService.uploadPhoto(requestData, function(data, message) {
						if (photoId > 0) {
							//Old Upload Photo
							$scope.issue.attachment = photoId;
							
							//load image from byte Array to display on page
							photoService.getByteArrayPhoto(photoId, function(data, message) {
								$scope.imageSource = utilService.getImageUrlBase64(data);
							});
							
						}
						else{
							//New Upload Photo
							photoService.getLastPhoto(function(data, message) {
								var newPhotoId = data.id;
								$scope.issue.attachment = newPhotoId;
								
								if (newPhotoId > 0) {
									//load image from byte Array to display on page
									photoService.getByteArrayPhoto(newPhotoId, function(data, message) {
										$scope.imageSource = utilService.getImageUrlBase64(data);
									});
								}
								
							});
							
						}
						//console.log(message);
					});
					
				}
				
				$scope.issueAttachmentName = fileName;
			}
			
			//clear input file after loading file dialog
			inputFileService.clearFileInput(this);
			
		});
		
	};
	
	//Bind Data into UI
	if (issues.length > 0) {
		$scope.issues = issues;
	}
	else{
		(function() {
			//Show Animation
			$scope.$emit('LOADPAGE');
			issueService.loadIssues(function(data, message) {
				$scope.issues = data;
				
				//Hide Animation
				$scope.$emit('UNLOADPAGE');
			});
		})();
	}
	if (contacts.length > 0) {
		$scope.contacts = contacts;
	}
	else{
		(function() {
			contactService.loadContacts(function(data, message) {
				$scope.contacts = data;
			});
		})();
	}
	if (categories.length > 0) {
		$scope.categories = categories;
	}
	else{
		(function() {
			categoryService.loadCategories(function(data, message) {
				$scope.categories = data;
			});
		})();
	}
	if (priorities.length > 0) {
		$scope.priorities = priorities;
	}else{
		(function() {
			priorityService.loadPriorities(function(data, message) {
				$scope.priorities = data;
			});
		})();
	}
	if (statusItems.length > 0) {
		$scope.statusItems = statusItems;
	}else{
		(function() {
			statusService.loadStatusItems(function(data, message) {
				$scope.statusItems = data;
			});
		})();//auto execute function
	}
	
	$scope.issueDate = new Date();//default display current date on openedDate
	$scope.datePicker = datePickerService;
	$scope.isVisibleRelatedIssue = !isUpdateIssue;
	
	var keepDefaultDisplay = function() {
		//Keep display current date on openedDate field
		if (!$scope.issue.openedDate) {
			$scope.issue.openedDate = $scope.issueDate;
		}
		
		//Keep select on (1) Category
		if (!$scope.issue.category) {
			$scope.issue.category = {id : 1};
		}
		
		//Keep select on Active Status
		if (!$scope.issue.status) {
			$scope.issue.status = {id : 1};
		}
		
		//Keep select on (2) Normal
		if (!$scope.issue.priority) {
			$scope.issue.priority = {id : 2};
		}
		
	};
	
	//Get Issue By ID if exist
	if (isUpdateIssue) {
		(function() {
			issueService.loadIssue(issueId, function(issue, message) {
				var photoId = issue.attachment ? issue.attachment : -1,
				dueDate = utilService.convertDateMilli(issue.dueDate),
				openedDate = utilService.convertDateMilli(issue.openedDate),
				followUntil = utilService.convertDateMilli(issue.followUntil),
				newIssue = {
					id : issue.id,
					partNum : issue.partNum,
					custName : issue.custName,
					jobNum : issue.jobNum,
					pressNum : issue.pressNum,
					moldNum : issue.moldNum,
					formulaNum : issue.formulaNum,
					assignedTo : issue.assignedTo,
					priority : issue.priority,
					status : issue.status,
					category : issue.category,
					dueDate : dueDate,
					openedDate : openedDate,
					openedBy : issue.openedBy,
					followUntil : followUntil,
					fix : issue.fix,
					problem : issue.problem,
					historicalFixes : issue.historicalFixes,
					historicalProblems : issue.historicalProblems,
					relatedIssues : issue.relatedIssues,
					attachment : photoId
				};
				
				//console.log(newIssue);
				$scope.issue = newIssue;
				$scope.relatedIssues = issue.relatedIssues;
				
				keepDefaultDisplay();
				
				//Get Byte Array Photo by ID
				if (photoId > 0) {
					//load image from byte Array to display on page
					photoService.getByteArrayPhoto(photoId, function(data, message) {
						$scope.isNewUploadImage = false;
						$scope.imageSource = utilService.getImageUrlBase64(data);
					});
				}
				
			});
		})();//auto execute function
	}
	else{
		//For creating New Issue
		$scope.issue = issue;
		keepDefaultDisplay();
	}
	
	// load auto completion data
	$scope.partNumList = [];
	$scope.custNameList = [];
	$scope.$watch("issue.partNum", function(partNum) {
		if (partNum && partNum.length >= 3) {
			var query = "PartNum like '" + partNum + "%'";
			issueService.searchPartNum(encodeURI(query), function(items) {
				$scope.partNumList.length = 0;
				$scope.custNameList.length = 0;
				angular.forEach(items, function(item) {
					$scope.partNumList.push(item.partNum);
					$scope.custNameList.push(item.custName);
				});
				
				if ($scope.partNumList.length > 0) {
					var newPartNumList = utilService.removeDuplicateList($scope.partNumList),
					newCustNameList = utilService.removeDuplicateList($scope.custNameList);
					$scope.partNumList = newPartNumList;
					$scope.custNameList = newCustNameList;
				}
			});
		}
	});
	
	$scope.getPartNum = function(partNum) {
		if (partNum.length >= 3) {
			var query = "PartNum like '" + partNum + "%'";
			return issueService.filterPartNum(query).then(function(response) {
				return response.data.map(function(item) {
					return item.partNum;
				});
			});
		}
		else{
			return [];
		}
	};
	
	$scope.getCustName = function(custName) {
		if ($scope.issue.partNum) {
			var query = "PartNum=" + $scope.issue.partNum;
			return issueService.filterPartNum(query).then(function(response) {
				return response.data.map(function(item) {
					return item.custName;
				});
			});
		}
		else{
			return [];
		}
	};
	
	//Open Modal Popup Page (modalRelatedIssue.html)
	$scope.openRelatedIssueModal = function(issue, size) {
		var relatedIssueIds = [],
		relatedIssues = $scope.relatedIssues || [];
		for(var i = 0; i < relatedIssues.length; i++) {
			relatedIssueIds.push(relatedIssues[i].id);
		}
		
		var item = {
			id : issue.id,
			partNum : issue.partNum,
			priority : issue.priority,
			assignedTo : issue.assignedTo,
			status : issue.status,
			openedBy : issue.openedBy,
			category : issue.category,
			priorities : $scope.priorities,
			contacts : $scope.contacts,
			statusItems : $scope.statusItems,
			categories : $scope.categories,
			issues : $scope.issues || [],
			relatedIssues : relatedIssues,
			relatedIssueIds : relatedIssueIds
		},
		modalInstance = $modal.open({
			templateUrl : "view/modalRelatedIssue.html",
			controller : ModalRelatedIssueInstanceCtrl,
			size : size,
			resolve : {
				item : function() {
					return item;
				}
			}
		});

		modalInstance.result.then(function(selectedItems) {
			//Get data from Modal Page (modalRelatedIssue.html Page)
			$scope.relatedIssues = selectedItems;
		}, function() {
			//When click on Cancel button in Modal Page (modalRelatedIssue.html Page)
			$log.info('Modal for Related Issues dismissed at: ' + new Date());
		});
	};
	
	//Override on Main Controller
	var newPage = {
		isTodoPage : true,
		isDetailPage : true,
		title : "Issue Details",
		todoLabel : "Todo List",
		isLinkReportPage : true,
		createLabel : createLabel,
		reportUrl : "report/issues",
		isDisplaySaveBtn : isUpdateIssue,
		reportLabel : "Generate Issue Report",
		storeIssues : pageService.getPage().storeIssues || []
	},
	doNewAction = function() {
		var issues = issueService.getIssues(),
		newIssueId = issues.length + 1,
		statusObj = $scope.issue.status,
		priorityObj = $scope.issue.priority,
		categoryObj = $scope.issue.category,
		openedByObj = $scope.issue.openedBy,
		assignedToObj = $scope.issue.assignedTo,
		dueDate = utilService.convertDate($scope.issue.dueDate),
		openedDate = utilService.convertDate($scope.issue.openedDate),
		followUntil = utilService.convertDate($scope.issue.followUntil),
		
		newIssue = {
			id : isUpdateIssue ? issueId : newIssueId,
			partNum : $scope.issue.partNum,
			custName : $scope.issue.custName,
			jobNum : $scope.issue.jobNum,
			pressNum : $scope.issue.pressNum,
			moldNum : $scope.issue.moldNum,
			formulaNum : $scope.issue.formulaNum,
			dueDate : dueDate,
			openedDate : openedDate,
			followUntil : followUntil,
			fix : $scope.issue.fix,
			problem : $scope.issue.problem,
			relatedIssues : $scope.relatedIssues || [],
			attachment : $scope.issue.attachment ? $scope.issue.attachment : 0
		};
		
		if (statusObj) {
			newIssue.status = statusObj.id;
		}
		if (priorityObj) {
			newIssue.priority = priorityObj.id;
		}
		if (categoryObj) {
			newIssue.category = categoryObj.id;
		}
		if (openedByObj) {
			newIssue.openedBy = openedByObj.id;
		}
		if (assignedToObj) {
			newIssue.assignedTo = assignedToObj.id;
		}
		//console.log(newIssue);
		
		//Save or Update Issue
		if (isUpdateIssue) {
			issueService.updateIssue(newIssue, function(data, message) {
				alert(message);
				$location.path("/issues");//redirect to issues page
			});
		}
		else{
			issueService.createIssue(newIssue, function(data, message) {
				alert(message);
				$location.path("/issues");//redirect to issues page
			});
		}
		
		//Clear Form
		//$scope.issue = {};
		
		//Keep Default Display
		keepDefaultDisplay();
	},
	newTodoAction = function() {
		var item = {
				issueID : $scope.issue.id,
				contacts : $scope.contacts
		},
		modalInstance = $modal.open({
			templateUrl : "view/modalTodo.html",
			controller : ModalTodoInstanceCtrl,
			size : "lg",
			resolve : {
				item : function() {
					return item;
				}
			}
		});

		modalInstance.result.then(function(selectedItems) {
			//Get data from Modal Page (modalTodo.html Page)
			$scope.relatedIssues = selectedItems;
		}, function() {
			//When click on Cancel button in Modal Page (modalTodo.html Page)
			$log.info('Modal for Todo dismissed at: ' + new Date());
		});
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
	pageService.setTodoClick(newTodoAction);
});

var ModalRelatedIssueInstanceCtrl = function($scope, $modalInstance, item, issueService, utilService) {
	$scope.item = item;
	$scope.newRelatedIssues = item.relatedIssues || [];
	
	$scope.toggleChecked = function(issue, isChecked) {
		var oldRelatedIssues = $scope.newRelatedIssues;
		$scope.newRelatedIssues = [];
		
		for(var i = 0; i < oldRelatedIssues.length; i++) {
			if (oldRelatedIssues[i].id == issue.id) {
				if (isChecked === false) {
					oldRelatedIssues.splice(i, 1);
				}
			}
			else{
				if (isChecked === true) {
					oldRelatedIssues.push(issue);
				}
			}
		}
		
		var relatedIssues = utilService.removeDuplicateList(oldRelatedIssues);
		relatedIssues = utilService.sortListAscById(relatedIssues);
		
		if (relatedIssues.length == 0 && isChecked) {
			relatedIssues.push(issue);
		}
		
		$scope.newRelatedIssues = relatedIssues;
	};
	
	$scope.find = function(search) {
		var issueFilter = {};
		if (search.partNum) {
			issueFilter.partNum = search.partNum;
		}
		if (search.assignedTo) {
			issueFilter.assignedTo = search.assignedTo;
		}
		if (search.status) {
			issueFilter.status = search.status;
		}
		if (search.openedBy) {
			issueFilter.openedBy = search.openedBy;
		}
		if (search.category) {
			issueFilter.openedBy = search.category;
		}
		if (search.priority) {
			issueFilter.priority = search.priority;
		}
		
		if (utilService.isValidObject(issueFilter)) {
			issueService.searchIssues(issueFilter, function(data, message) {
				$scope.item.issues = data;
				//console.log(message);
			});
		}
		
	};

	$scope.ok = function() {
		$modalInstance.close($scope.newRelatedIssues);//pass data from Modal into Page (Issue Detail Page)
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};

var ModalTodoInstanceCtrl = function($scope, $modal, $log, $modalInstance, $timeout, $location, item, datePickerService, todoService, issueService, utilService) {
	//Date Picker
	$scope.datePicker = datePickerService;
	$scope.initDatePicker = function() {
		var date_add = datePickerService.getDateAdd(10),
		date_minus = datePickerService.getDateMinus(10);
		
		$scope.minWhen = $scope.minWhen ? null : date_minus;
		$scope.maxWhen = $scope.maxWhen ? null : date_add;
	};
	$scope.initDatePicker();
	
	$scope.openWhen = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		
		$timeout(function() {
			$scope.openedWhen = true;
		});
	};
	
	// load auto completion data
	$scope.issuesByPartNum = [];
	$scope.partNumList = [];
	$scope.$watch("todo.partNum", function(partNum) {
		if (partNum && partNum.length >= 3) {
			issueService.loadPartNumIssues(partNum, function(items, message) {
				$scope.partNumList.length = 0;
				angular.forEach(items, function(item) {
					var issueByPartNum = {
							issueID : item.id,
							partNum : item.partNum
					};
					$scope.partNumList.push(item.partNum);
					$scope.issuesByPartNum.push(issueByPartNum);
				});
				
				if ($scope.partNumList.length > 0) {
					var newPartNumList = utilService.removeDuplicateList($scope.partNumList);
					$scope.partNumList = newPartNumList;
				}
			});
		}
	});
	
	//Hidden Scroll
	document.documentElement.style.overflow = 'hidden';  // firefox, chrome
	document.body.scroll = "no"; // ie only
	
	//Bind Data
	var contacts = item.contacts;
	$scope.contacts = contacts;
	
	$scope.todolist = [];
	$scope.todo = {};
	$scope.addBtnLabel = "Add New";
	
	//load Todo list
	(function() {
		//Pagination configure
		$scope.curPage = 0;
		$scope.pageSize = 200;
		$scope.numberOfPages = function() {
			return 1;
		};
		
		todoService.loadTodoCustomlist(function(todolist, message) {
			$scope.todolist = todolist;
			$scope.numberOfPages = function() {
				return Math.ceil($scope.todolist.length / $scope.pageSize);
			};
		});
	})();
	
	$scope.upsertTodo = function() {
		var newTodo = $scope.todo,
		newTodoId = $scope.todolist.length + 1,
		isUpdateTodo = ($scope.addBtnLabel != "Add New");
		
		if (newTodo.who && newTodo.dueDate && newTodo.what) {
			var contact = {};
			for (var i = 0; i < contacts.length; i++) {
				if (contacts[i].id === newTodo.who) {
					contact = contacts[i];
					break;
				}
			}
			
			var firstName = contact.firstName? contact.firstName : "",
			lastName = contact.lastName? contact.lastName : "",
			tmpNewTodo = {
				id : isUpdateTodo ? newTodo.id : newTodoId,
				who : newTodo.who,
				what : newTodo.what,
				dueDate : newTodo.dueDate,
				partNum : newTodo.partNum,
				isCompleted : newTodo.completed ? 1 : 0
			},
			newTodoList = {
				id : isUpdateTodo ? newTodo.id : newTodoId,
				who : newTodo.who,
				what : newTodo.what,
				dueDate : newTodo.dueDate,
				partNum : newTodo.partNum,
				completed : newTodo.completed,
				contact : firstName + ' ' + lastName
			};
			
			// add ISSUE_ID if exist
			if (utilService.isNumber(item.issueID)) {
				tmpNewTodo.issueID = item.issueID;
				newTodoList.issueID = item.issueID;
			}
			
			if (isUpdateTodo) {
				$scope.addBtnLabel = "Add New";
				todoService.updateTodoCustom(tmpNewTodo, function(data, message) {
					//find index
					var index = -1,
					todolist = $scope.todolist;
					for (var i = 0; i < todolist.length; i++) {
						if (todolist[i].id === newTodo.id) {
							index = i;
							break;
						}
					}
					
					//remove one item from list
					if (index != -1) {
						$scope.todolist.splice(index, 1);
					}
					
					//add new item
					$scope.todolist.push(newTodoList);
					utilService.sortListDescById($scope.todolist);
					
					alert(message);
				});
			}
			else{
				//Add New Data
				todoService.createTodoCustom(tmpNewTodo, function(data, message) {
					//add new item
					todoService.getLastTodo(function(data, message) {
						//add new item
						$scope.todolist.splice( 0, 0, data);//add to first index
						
						alert(message);
					});
				});
			}
			
			$scope.todo = {};//clear form
		}
	}
	
	$scope.doEditTodo = function(editTodo) {
		$scope.todo = editTodo;
		$scope.addBtnLabel = "Edit";
	}
	
	$scope.ok = function() {
		//Show Scroll
		document.documentElement.style.overflow = 'auto';  // firefox, chrome
		document.body.style.overflow = 'auto';
		document.body.scroll = "yes"; // ie only
		
		$modalInstance.close(item);//pass data from Modal into Page (Issue Detail Page)
	};

	$scope.cancel = function() {
		//Show Scroll
		document.documentElement.style.overflow = 'auto';  // firefox, chrome
		document.body.style.overflow = 'auto';
		document.body.scroll = "yes"; // ie only
		
		$modalInstance.dismiss('cancel');
	};
	
	$scope.linkToTodos = function() {
		$scope.cancel();
		$location.path("/todos");
	}
	
	$scope.linkToTodoReport = function() {
		$scope.cancel();
		$location.path("/report/todos");
	}
};