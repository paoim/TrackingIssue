/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Todo Controller
issueTrackerApp.controller("TodoController", function($scope, $modal, $log, $timeout, $filter, pageService, todoService, contactService, inputFileService, utilService) {
	var newPage = {
		title : "Todos List",
		isDetailPage : false,
		isLinkReportPage : true,
		isUploadExcelFile : false,//flag to show or hide upload button
		createLabel : "New Todo",
		reportUrl : "report/todos",
		createUrl : "todos/todo/view/newID",
		reportLabel : "Generate Todo Report",
		uploadLabel : "Click to upload Todos",
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	loadTodosList = function() {
		//Show Animation
		$scope.$emit('LOADPAGE');
		
		var today = new Date(),
		endDate = utilService.addDays(today, 1),//current month and tomorrow
		startDate = utilService.minusDateMonth(today, 1);//last month
		
		endDate = $filter('date')(endDate, 'yyyy-MM-dd');
		startDate = $filter('date')(startDate, 'yyyy-MM-dd');
		//console.log("startDate: " + startDate + " with endDate: " + endDate);
		
		var todoFilter = {isDefault : 0, status : 0};
		
		//Pagination configure
		$scope.curPage = 0;
		$scope.pageSize = 200;
		$scope.todolist = [];
		$scope.numberOfPages = function() {
			return 1;
		};
		
		//encodeURI(query)
		todoService.loadTodoReport(todoFilter, function(todoList, message) {
			$scope.todolist = todoList;
			$scope.numberOfPages = function() {
				return ($scope.todolist.length == 0 ? 1 : Math.ceil($scope.todolist.length / $scope.pageSize));
			};
			
			//Hide Animation
			$scope.$emit('UNLOADPAGE');
		});
	};
	
	//Init Data
	loadTodosList();
	
	//load contacts
	(function() {
		contactService.loadContacts(function(data, message) {
			$scope.contacts = data;
		});
	})();
	
	//init searchTodo for search form
	$scope.searchTodo = {};
	
	// open search form label
	$scope.openSearchFormLabel = "Open Search Form";
	
	$scope.compareDates = function() {
		var isAvailableSearch = true,
		searchTodo = $scope.searchTodo;
		
		if (searchTodo && searchTodo.startDate && searchTodo.endDate) {
			//console.log(searchTodo);
			isAvailableSearch = false;
			
			if (searchTodo.startDate > searchTodo.endDate) {
				isAvailableSearch = true;
				
				alert("Start Date must be smaller than End Date.");
				$scope.searchTodo.endDate = "";
				$scope.searchTodo.startDate = "";
			}
			
		}
		
		$scope.availableSearchTodo = isAvailableSearch;
	};
	
	//Check input Data, search & reset button will enable when input data
	var checkSearchInput = function(inputData) {
		var isAvailableSearch = true;
		if (inputData) {
			isAvailableSearch = false;
		}
		
		$scope.availableSearchTodo = isAvailableSearch;
	}
	checkSearchInput();//init method to disable both search & reset button
	
	// load auto completion data
	$scope.partNumList = [];
	$scope.$watch("searchTodo.partNum", function(partNum) {
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
		checkSearchInput(partNum);
	});
	
	$scope.$watch('searchTodo.who', function(who) {
		checkSearchInput(who);
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
	$scope.doSearchTodo = function() {
		var searchTodo = $scope.searchTodo,
		todoFilter = {isDefault : 0, status : 0};
		
		if (searchTodo) {
			// Close Search Form
			$scope.isOpenSearchForm = false;
			$scope.openSearchFormLabel = "Open Search Form";
			
			//Show Animation
			$scope.$emit('LOADSEARCH');
			
			if (searchTodo.startDate && searchTodo.endDate) {
				var startDate = searchTodo.startDate,
				endDate = searchTodo.endDate;
				
				//Add one day if equal date
				if (utilService.getStrDateDDMMYYYY(startDate) == utilService.getStrDateDDMMYYYY(endDate)) {
					endDate = utilService.addDays(startDate, 1);
				}
				
				endDate = $filter('date')(endDate, 'yyyy-MM-dd');
				startDate = $filter('date')(startDate, 'yyyy-MM-dd');
				//console.log("startDate: " + startDate + " with endDate: " + endDate);
				
				todoFilter.startDate = startDate;
				todoFilter.endDate = endDate;
			}
			
			if (searchTodo.who) {
				todoFilter.who = searchTodo.who;
			}
			
			if (searchTodo.partNum) {
				todoFilter.partNum = searchTodo.partNum;
			}
			
			//Pagination configure
			$scope.curPage = 0;
			$scope.pageSize = 200;
			$scope.todolist = [];
			$scope.numberOfPages = function() {
				return 1;
			};
			
			//encodeURI(query)
			todoService.loadTodoReport(todoFilter, function(todoList, message) {
				$scope.todolist = todoList;
				$scope.numberOfPages = function() {
					return ($scope.todolist.length == 0 ? 1 : Math.ceil($scope.todolist.length / $scope.pageSize));
				};
				
				//Hide Animation
				$scope.$emit('UNLOADSEARCH');
			});
			
		}
	};
	
	// Reset Button
	$scope.resetSearchTodo = function() {
		$scope.searchTodo = {};// clear form
		
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
					//console.log("Üpload file's size: " + fileSize + "KB");
					
					todoService.uploadTodoCsv(requestData, function(data, message) {
						//console.log(data);
						//console.log(message);
						loadTodosList();
					});
				}
				
				//clear input file after loading file dialog
				inputFileService.clearFileInput(this);
			});
		}, 0, false);
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
});


//Create Todo Detail Controller
issueTrackerApp.controller("TodoDetailController", function($scope, $routeParams, $location, pageService, todoService, issueService, contactService, datePickerService, utilService) {
	var todoId = utilService.getId($routeParams.todoId),
	todo = {id : todoId},
	isUpdateTodo = false,
	createLabel = "Save Todo";
	
	//Get Todo ID
	if (utilService.isNumber(todoId)) {
		isUpdateTodo = true;
		createLabel = "Update Todo";
	}
	
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
		
		$scope.openedWhen = true;
	};
	
	// load auto completion data
	$scope.partNumList = [];
	$scope.$watch("todo.partNum", function(partNum) {
		if (partNum && partNum.length >= 3) {
			issueService.loadPartNumIssues(partNum, function(items, message) {
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
		contactService.loadContacts(function(data, message) {
			$scope.contacts = data;
		});
	})();
	
	//Load Todo by ID
	if (isUpdateTodo) {
		(function() {
			todoService.loadTodo(todoId, function(todo, message) {
				$scope.todo = todo;
			});
		})();//auto execute function
	}
	else{
		$scope.todo = todo;
	}
	
	//Set up page configure
	var newPage = {
		isPartNum : false,
		isDetailPage : true,
		title : "Todo Details",
		isLinkReportPage : true,
		createLabel : createLabel,
		reportUrl : "report/todos",
		isDisplaySaveBtn : isUpdateTodo,
		reportLabel : "Generate Todo Report",
		isAlreadySendToEveryOne : pageService.getPage().isAlreadySendToEveryOne,
		isAlreadySendToSupervisor : pageService.getPage().isAlreadySendToSupervisor,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	doNewAction = function() {
		var todosList = todoService.getTodolist(),
		newTodoId = todosList.length + 1,
		newTodo = {
			id : isUpdateTodo ? todoId : newTodoId,
			who : $scope.todo.who,
			what : $scope.todo.what,
			dueDate : $scope.todo.dueDate,
			partNum : $scope.todo.partNum,
			isCompleted : $scope.todo.completed ? 1 : 0
		};
		
		//Update Todo
		if (isUpdateTodo) {
			todoService.updateTodo(newTodo, function(data, message) {
				alert(message);
				$location.path("/todos");//redirect to todos list page
				//$location.reload();
			});
		}
		else{
			todoService.createTodo(newTodo, function(data, message) {
				alert(message);
				$location.path("/todos");
				//$location.reload();
			});
		}
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
});
