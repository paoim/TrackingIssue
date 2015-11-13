/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
** Create Date: 01/18/2015
*********************************************/
// Create Issues Controller
issueTrackerApp.controller("IssuesController", function($scope, $modal, $log, $templateCache, $filter, pageService, issueService, contactService, statusService, utilService){
	//console.log(">> Start IssuesController...");
	var newPage = {
		curPage : pageService.getPage().curPage,
		pageSize : pageService.getPage().pageSize,
		numberOfPages : pageService.getPage().numberOfPages,
		storeIssues : pageService.getPage().storeIssues || [],
		//isSearchForm : pageService.getPage().isSearchForm || true,
		isListingPage : pageService.getPage().isListingPage || true
	};
	
	//init criteria for search form
	$scope.criteria = {};
	
	// open search form label
	$scope.openSearchFormLabel = "Open Search Form";
	
	$scope.compareDates = function(){
		var isAvailableSearch = true,
		criteria = $scope.criteria;
		
		if(criteria && criteria.startDate && criteria.endDate){
			isAvailableSearch = false;
			
			if(criteria.startDate > criteria.endDate){
				isAvailableSearch = true;
				
				alert("Start Date must be smaller than End Date.");
				$scope.criteria.endDate = "";
				$scope.criteria.startDate = "";
			}
			
		}
		
		$scope.availableSearchIssue = isAvailableSearch;
	};
	
	// Any function returning a promise object can be used to load values asynchronously
	$scope.getPartNum = function(partNum) {
		var query = "PartNum like '" + partNum + "%'";
		//Start searching partNum when it has more than 2 characters
		if(partNum.length >= 3){
			return issueService.filterIssues(query).then(function(response){
				return response.data.map(function(item){
					return item.partNum;
				});
			});
		}
		else{
			return [];
		}
	};
	
	//Load default data
	(function(){
		if(newPage.storeIssues.length == 0){
			var query = "",
			today = new Date(),
			endDate = utilService.addDays(today, 1),//current month and tomorrow
			startDate = utilService.minusDateMonth(today, 1);//last month
			
			//Show Animation
			$scope.$emit('LOAD');
			
			endDate = $filter('date')(endDate, 'yyyy-MM-dd');
			startDate = $filter('date')(startDate, 'yyyy-MM-dd');
			//console.log("startDate: " + startDate + " with endDate: " + endDate);
			
			query = "where iss.status = 1 and ((iss.openedDate >= '" + startDate + "' and iss.openedDate <= '" + endDate + "') or (iss.dueDate >= '" + startDate + "' and iss.dueDate <= '" + endDate + "'))";
			
			issueService.quickPartReport(encodeURI(query), function(issuesList, message){
				var numberOfPages =  Math.ceil(issuesList.length / newPage.pageSize);
				newPage.numberOfPages = (numberOfPages == 0 ? 1 : numberOfPages);
				newPage.storeIssues = issuesList || [];
				
				//Hide Animation
				$scope.$emit('UNLOAD');
			});
		}
		
	})();
	
	(function(){
		contactService.loadContacts(function(contacts, message){
			var contactItems = [{}];
			for(var i = 0; i < contacts.length; i++){
				var name = "",
				contact = contacts[i];
				
				if(contact.firstName){
					name = contact.firstName + ' ';
				}
				if(contact.lastName){
					name = name + contact.lastName;
				}
				
				var contactItem = {id : contact.id, name : name};
				contactItems.push(contactItem);
			}
			
			$scope.contactItems = contactItems;
		});
		
	})();
	
	(function(){
		statusService.loadStatusItems(function(statusItems, message){
			$scope.statusItems = statusItems;
		});
	})();
	
	//Check input Data, search & reset button will enable when input data
	var checkSearchInput = function(inputData){
		var isAvailableSearch= true;
		if(inputData){
			isAvailableSearch= false;
		}
		
		$scope.availableSearchIssue = isAvailableSearch;
	}
	checkSearchInput();//init method to disable both search & reset button
	
	//$scope.$watch('criteria.startDate', function(startDate) {
		//checkSearchInput(startDate);
	//});
	
	//$scope.$watch('criteria.endDate', function(endDate) {
		//checkSearchInput(endDate);
	//});
	
	$scope.$watch('criteria.partNum', function(partNum) {
		checkSearchInput(partNum);
	});
	
	$scope.$watch('criteria.openedBy', function(openedBy) {
		checkSearchInput(openedBy);
	});
	
	$scope.$watch('criteria.assignedTo', function(assignedTo) {
		checkSearchInput(assignedTo);
	});
	
	$scope.$watch('criteria.status', function(status) {
		checkSearchInput(status);
	});
	
	$scope.isNoResult = false;
	$scope.keepIssuesList = newPage.storeIssues || [];
	
	//Open Search Form buttons
	$scope.openSearchForm = function() {
		$scope.page.getPage().isSearchForm = !$scope.page.getPage().isSearchForm;
		var label = "Open Search Form";
		if ($scope.page.getPage().isSearchForm) {
			label = "Close Search Form";
		}
		$scope.openSearchFormLabel = label;
	};
	
	// Search Button
	$scope.searchIssue = function() {
		var query = "",
		criteria = $scope.criteria;
		
		if(criteria){
			//Show Animation
			$scope.$emit('LOAD');
			
			if(criteria.startDate && criteria.endDate){
				var startDate = criteria.startDate,
				endDate = criteria.endDate;
				
				//Add one day if equal date
				if(utilService.getStrDateDDMMYYYY(startDate) == utilService.getStrDateDDMMYYYY(endDate)){
					endDate = utilService.addDays(startDate, 1);
				}
				
				endDate = $filter('date')(endDate, 'yyyy-MM-dd');
				startDate = $filter('date')(startDate, 'yyyy-MM-dd');
				query = query + "((iss.openedDate >= '" + startDate + "' and iss.openedDate <= '" + endDate + "') or (iss.dueDate >= '" + startDate + "' and iss.dueDate <= '" + endDate + "')) and ";
			}
			if(criteria.partNum){
				query = query + "iss.partNum = '" + criteria.partNum + "' and ";
			}
			if(criteria.openedBy){
				query = query + "iss.openedBy = " + criteria.openedBy.id + " and ";
			}
			if(criteria.assignedTo){
				query = query + "iss.assignedTo = " + criteria.assignedTo.id + " and ";
			}
			if(criteria.status){
				query = query + "iss.status = " + criteria.status.id;
			}
			
			if (query.length > 0) {
				if(utilService.endsWith(query, " and ") > 0){
					query = query.substring(0, query.length - " and ".length);
				}
				
				query = "where " + query;
			}
			
			issueService.quickPartReport(encodeURI(query), function(issuesList, message){
				var totalIssues = issuesList.length,
				numberOfPages =  Math.ceil(totalIssues / newPage.pageSize);
				
				$scope.keepIssuesList = (totalIssues == 0 ? newPage.storeIssues || [] : issuesList || []);
				newPage.numberOfPages = (numberOfPages == 0 ? 1 : numberOfPages);
				newPage.storeIssues = issuesList || [];
				
				$scope.isNoResult = (totalIssues == 0);
				
				// Close Search Form
				$scope.page.getPage().isSearchForm = false;
				$scope.openSearchFormLabel = "Open Search Form";
				
				//Hide Animation
				$scope.$emit('UNLOAD');
			});
		}
	};
	
	$scope.resetSearchIssue = function(){
		$scope.criteria = {};// clear form
		
		$scope.isNoResult = false;
		checkSearchInput();
		
		// Keep old data display
		var numberOfPages =  Math.ceil($scope.keepIssuesList.length / newPage.pageSize);
		
		newPage.storeIssues = (newPage.storeIssues.length == 0 ? $scope.keepIssuesList : newPage.storeIssues);
		newPage.numberOfPages = (numberOfPages == 0 ? 1 : numberOfPages);
		$scope.keepIssuesList = [];
	};
	
	pageService.setPage(newPage);
	
	//console.log(">> End IssuesController...");
});

//Create Issue Detail Controller
issueTrackerApp.controller("IssueDetailController", function($scope, $routeParams, $location, $modal, $log, $filter, pageService, utilService, issueService, photoService, contactService, priorityService, statusService, categoryService, inputFileService){
	var isUpdateIssue = false,
	buttonLabel = "Save and New",
	issues = pageService.getPage().storeIssues || [],
	issueId = utilService.getId($routeParams.issueId),
	issue = {id : issueId};
	
	//Get Issue by ID
	if(utilService.isNumber(issueId)){
		isUpdateIssue = true;
		buttonLabel = "Update Issue";
	}
	$scope.buttonLabel = buttonLabel;
	
	//Check input Data, search & reset button will enable when input data
	var checkSearchInput = function(inputData){
		var isAvailableSearch= true;
		if(inputData){
			isAvailableSearch= false;
		}
		
		$scope.availableUpsertBtn = isAvailableSearch;
	}
	checkSearchInput();//init method to disable both search & reset button
	$scope.isUpdateIssue = isUpdateIssue;
	
	//Upload Image
	$scope.imageSource = "";
	$scope.isNewUploadImage = true;
	$scope.openFileDialog = function(){
		var fileSelector = inputFileService.getSelectorById("issueAttachment");
		inputFileService.loadFileDialog(fileSelector);
		
		inputFileService.addFileSelectedListener(fileSelector, function(){
			$scope.isNewUploadImage = false;
			var files = this.files,
			photoId = ($scope.issue.attachment ? $scope.issue.attachment : 0);
			
			if(files && files.length > 0){
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
				if(!(fileName === $scope.issueAttachmentName)){
					photoService.uploadPhoto(requestData, function(data, message){
						if(photoId > 0){
							//Old Upload Photo
							$scope.issue.attachment = photoId;
							
							//load image from byte Array to display on page
							photoService.getByteArrayPhoto(photoId, function(data, message){
								$scope.imageSource = utilService.getImageUrlBase64(data);
							});
							
						}
						else{
							//New Upload Photo
							photoService.getLastPhoto(function(data, message){
								var newPhotoId = data.id;
								$scope.issue.attachment = newPhotoId;
								
								if(newPhotoId > 0){
									//load image from byte Array to display on page
									photoService.getByteArrayPhoto(newPhotoId, function(data, message){
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
	(function(){
		issueService.loadIssues(function(data, message){
			$scope.issues = data; // for related issues
		});
	})();
	(function(){
		contactService.loadContacts(function(data, message){
			$scope.contacts = data;
		});
	})();
	(function(){
		categoryService.loadCategories(function(data, message){
			$scope.categories = data;
		});
	})();
	(function(){
		priorityService.loadPriorities(function(data, message){
			$scope.priorities = data;
		});
	})();
	(function(){
		statusService.loadStatusItems(function(data, message){
			$scope.statusItems = data;
		});
	})();//auto execute function
	
	$scope.issueDate = new Date();//default display current date on openedDate
	$scope.isVisibleRelatedIssue = !isUpdateIssue;
	
	// load auto completion data
	$scope.partNumList = [];
	$scope.custNameList = [];
	$scope.$watch("issue.partNum", function(partNum){
		checkSearchInput(partNum);
		if($scope.issue && $scope.issue.custName){
			$scope.issue.custName = "";
		}
		
		if(partNum && partNum.length > 3){
			var query = "PartNum like '" + partNum + "%'";
			issueService.searchPartNum(encodeURI(query), function(items){
				$scope.partNumList.length = 0;
				$scope.custNameList.length = 0;
				angular.forEach(items, function(item) {
					$scope.partNumList.push(item.partNum);
					$scope.custNameList.push(item.custName);
				});
				
				if($scope.partNumList.length > 0){
					var newPartNumList = utilService.removeDuplicateList($scope.partNumList),
					newCustNameList = utilService.removeDuplicateList($scope.custNameList);
					$scope.partNumList = newPartNumList;
					$scope.custNameList = newCustNameList;
				}
				
				newCustNameList = $scope.custNameList;
				$scope.custNameList = [];
				var custNameSelectedObj = {id : 0, name : $scope.custName};
				for(var i = 0; i < newCustNameList.length; i++) {
					var custNameObj = {id : i, name : newCustNameList[i]};
					if ($scope.custName && newCustNameList[i] == $scope.custName) {
						custNameSelectedObj = custNameObj;
					}
					$scope.custNameList.push(custNameObj);
				}
				if ($scope.custNameList.length == 0) {
					$scope.custNameList.push(custNameSelectedObj);
				}
				if ($scope.partNum && $scope.custName && $scope.partNum.length > 0 && $scope.custName.length > 0 && $scope.partNum == partNum) {
					$scope.issue.custName = custNameSelectedObj; // set selected on CustName
				}
			});
		}
	});
	
	$scope.$watch("issue.custName", function(custName){
		checkSearchInput(custName);
	});
	
	$scope.$watch("issue.assignedTo", function(assignedTo){
		checkSearchInput(assignedTo);
	});
	
	var keepDefaultDisplay = function(){
		//Keep display current date on openedDate field
		if(!$scope.issue.openedDate){
			$scope.issue.openedDate = $filter('date')($scope.issueDate, 'yyyy-MM-dd');
		}
		
		//Keep select on (1) Category
		if(!$scope.issue.category){
			$scope.issue.category = {id : 1};
		}
		
		//Keep select on Active Status
		if(!$scope.issue.status){
			$scope.issue.status = {id : 1};
		}
		
		//Keep select on (2) Normal
		if(!$scope.issue.priority){
			$scope.issue.priority = {id : 2};
		}
		
	};
	
	//Get Issue By ID if exist
	if(isUpdateIssue){
		(function(){
			issueService.loadIssue(issueId, function(issue, message){
				var partNum = issue.partNum,
				custName = issue.custName;
				$scope.partNum = partNum;
				$scope.custName = custName; // Store CustName in Scope
				
				var photoId = issue.attachment ? issue.attachment : -1,
				dueDate = $filter('date')(issue.dueDate, 'yyyy-MM-dd'),
				openedDate = $filter('date')(issue.openedDate, 'yyyy-MM-dd'),
				followUntil = $filter('date')(issue.followUntil, 'yyyy-MM-dd'),
				newIssue = {
					id : issue.id,
					partNum : partNum,
					custName : custName,
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
				if(photoId > 0){
					//load image from byte Array to display on page
					photoService.getByteArrayPhoto(photoId, function(data, message){
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
	
	//Open Modal Popup Page (modalRelatedIssue.html)
	$scope.openRelatedIssueModal = function(issue, size){
		var relatedIssueIds = [],
		relatedIssues = $scope.relatedIssues || [];
		//newRelatedIssues = (relatedIssues.length > 0 ? relatedIssues : (issue.relatedIssues || []));
		for(var i = 0; i < relatedIssues.length; i++){
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
		curPage : pageService.getPage().curPage,
		pageSize : pageService.getPage().pageSize,
		numberOfPages : pageService.getPage().numberOfPages,
		storeIssues : pageService.getPage().storeIssues || []
	},
	doNewAction = function(){
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
		custName = $scope.custNameList[$scope.issue.custName.id],
		
		newIssue = {
			id : isUpdateIssue ? issueId : newIssueId,
			partNum : $scope.issue.partNum,
			custName : custName.name,
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
		
		if(statusObj){
			newIssue.status = statusObj.id;
		}
		if(priorityObj){
			newIssue.priority = priorityObj.id;
		}
		if(categoryObj){
			newIssue.category = categoryObj.id;
		}
		if(openedByObj){
			newIssue.openedBy = openedByObj.id;
		}
		if(assignedToObj){
			newIssue.assignedTo = assignedToObj.id;
		}
		//console.log(newIssue);
		
		//Save or Update Issue
		if(isUpdateIssue){
			issueService.updateIssue(newIssue, function(data, message){
				alert(message);
				$location.path("/issues");//redirect to issues page
			});
		}
		else{
			issueService.createIssue(newIssue, function(data, message){
				alert(message);
				$location.path("/issues");//redirect to issues page
			});
		}
		
		//Keep Default Display
		keepDefaultDisplay();
	};
	
	$scope.upsertIssue = function(){
		doNewAction();
	};
	
	$scope.resetUpsertIssue = function(){
		//Clear Form
		var newIssue = {id : issueId};
		if(isUpdateIssue){
			newIssue = {};
		}
		$scope.issue = newIssue;
		checkSearchInput();
	};
	
	pageService.setPage(newPage);
});

var ModalRelatedIssueInstanceCtrl = function($scope, $modalInstance, item, issueService, utilService) {
	$scope.item = item;
	$scope.newRelatedIssues = item.relatedIssues || [];
	
	$scope.toggleChecked = function(issue, isChecked){
		var oldRelatedIssues = $scope.newRelatedIssues;
		$scope.newRelatedIssues = [];
		
		for(var i = 0; i < oldRelatedIssues.length; i++){
			if(oldRelatedIssues[i].id == issue.id){
				if(isChecked === false){
					oldRelatedIssues.splice(i, 1);
				}
			}
			else{
				if(isChecked === true){
					oldRelatedIssues.push(issue);
				}
			}
		}
		
		var relatedIssues = utilService.removeDuplicateList(oldRelatedIssues);
		relatedIssues = utilService.sortListAscById(relatedIssues);
		
		if(relatedIssues.length == 0 && isChecked){
			relatedIssues.push(issue);
		}
		
		$scope.newRelatedIssues = relatedIssues;
	};
	
	$scope.find = function(search){
		var query = "", operator = "";
		if(search.partNum){
			query = query + "partNum like '" + search.partNum + "%'";
			operator = " and ";
		}
		if(search.assignedTo){
			query = query + (operator.length > 0 ? operator : "") + "assignedTo like '" + search.assignedTo + "%'";
			operator = " and ";
		}
		if(search.status){
			query = query + (operator.length > 0 ? operator : "") + "status like '" + search.status + "%'";
			operator = " and ";
		}
		if(search.openedBy){
			query = query + (operator.length > 0 ? operator : "") + "openedBy like '" + search.openedBy + "%'";
			operator = " and ";
		}
		if(search.category){
			query = query + (operator.length > 0 ? operator : "") + "category like '" + search.category + "%'";
			operator = " and ";
		}
		if(search.priority){
			query = query + (operator.length > 0 ? operator : "") + "priority like '" + search.priority + "%'";
			operator = " and ";
		}
		
		if(query.length > 0){
			issueService.searchIssues(encodeURI(query), function(data, message){
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