/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Todo Controller
issueTrackerApp.controller("TodosController", function($scope, $timeout, $filter, pageService, todoService, utilService) {
	//console.log(">> Start TodosController...");
	var newPage = {
			curPage : pageService.getPage().curPage,
			pageSize : pageService.getPage().pageSize,
			numberOfPages : pageService.getPage().numberOfPages,
			storeIssues : pageService.getPage().storeIssues || [],
			//isSearchForm : pageService.getPage().isSearchForm || true,
			isListingPage : pageService.getPage().isListingPage || true
	},
	loadTodosList = function() {
		
		//Show Animation
		$scope.$emit('LOAD');
		
		var query = "",
		today = new Date(),
		endDate = utilService.addDays(today, 1),//current month and tomorrow
		startDate = utilService.minusDateMonth(today, 1);//last month
		
		endDate = $filter('date')(endDate, 'yyyy-MM-dd');
		startDate = $filter('date')(startDate, 'yyyy-MM-dd');
		//console.log("startDate: " + startDate + " with endDate: " + endDate);
		
		query = "(dueDate >= '" + startDate + "' and dueDate <= '" + endDate + "')";
		
		todoService.loadTodoReport(encodeURI(query), function(todoList, message) {
			$scope.todoList = todoList;
			var numberOfPages =  Math.ceil(todoList.length / newPage.pageSize);
			newPage.numberOfPages = (numberOfPages == 0 ? 1 : numberOfPages);
			
			//Hide Animation
			$scope.$emit('UNLOAD');
		});
	};
	
	//Init Data
	loadTodosList();
	
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
	
	$scope.isNoResult = false;
	
	//Open Search Form button
	$scope.openSearchForm = function() {
		$scope.page.getPage().isSearchForm = !$scope.page.getPage().isSearchForm;
		var label = "Open Search Form";
		if ($scope.page.getPage().isSearchForm) {
			label = "Close Search Form";
		}
		$scope.openSearchFormLabel = label;
	};
	
	// Search Button
	$scope.doSearchTodo = function() {
		var query = "",
		searchTodo = $scope.searchTodo;
		
		if (searchTodo) {
			//Show Animation
			$scope.$emit('LOAD');
			
			if (searchTodo.startDate && searchTodo.endDate) {
				var startDate = searchTodo.startDate,
				endDate = searchTodo.endDate;
				
				//Add one day if equal date
				if (utilService.getStrDateDDMMYYYY(startDate) == utilService.getStrDateDDMMYYYY(endDate)) {
					endDate = utilService.addDays(startDate, 1);
				}
				
				endDate = $filter('date')(endDate, 'yyyy-MM-dd');
				startDate = $filter('date')(startDate, 'yyyy-MM-dd');
				query = "(dueDate >= '" + startDate + "' and dueDate <= '" + endDate + "')";
				//console.log("startDate: " + startDate + " with endDate: " + endDate);
				
				todoService.loadTodoReport(encodeURI(query), function(todoList, message) {
					$scope.todoList = todoList;
					var numberOfPages =  Math.ceil(todoList.length / newPage.pageSize);
					newPage.numberOfPages = (numberOfPages == 0 ? 1 : numberOfPages);
					
					$scope.isNoResult = (todoList.length == 0);
					
					// Close Search Form
					$scope.page.getPage().isSearchForm = false;
					$scope.openSearchFormLabel = "Open Search Form";
					
					//Hide Animation
					$scope.$emit('UNLOAD');
				});
			}
		}
	};
	
	$scope.resetSearchTodo = function() {
		$scope.searchTodo = {};
		$scope.isNoResult = false;
		checkSearchInput();
	};
	
	pageService.setPage(newPage);
	
	//console.log(">> End TodosController...");
});

//Create Todo Detail Controller
issueTrackerApp.controller("TodoDetailController", function($scope, $routeParams, $location, $filter, pageService, todoService, issueService, contactService, utilService) {
	var isUpdateTodo = false,
	buttonLabel = "Save and New",
	todoId = utilService.getId($routeParams.todoId),
	todo = {id : todoId};
	
	//Get Todo ID
	if (utilService.isNumber(todoId)) {
		isUpdateTodo = true;
		buttonLabel = "Update Todo";
	}
	$scope.buttonLabel = buttonLabel;
	
	//Check input Data, search & reset button will enable when input data
	var checkSearchInput = function(inputData) {
		var isAvailableSearch= true;
		if (inputData) {
			isAvailableSearch= false;
		}
		
		$scope.availableUpsertBtn = isAvailableSearch;
	}
	checkSearchInput();//init method to disable both search & reset button
	$scope.isUpdateTodo = isUpdateTodo;
	
	$scope.$watch("todo.who", function(who) {
		checkSearchInput(who);
	});
	
	$scope.$watch("todo.dueDate", function(dueDate) {
		checkSearchInput(dueDate);
	});
	
	$scope.$watch("todo.what", function(what) {
		checkSearchInput(what);
	});
	
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
		checkSearchInput(partNum);
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
				var dueDate = $filter('date')(todo.dueDate, 'yyyy-MM-dd'),
				newTodo = {
					id : todo.id,
					who : todo.who,
					dueDate : dueDate,
					what : todo.what,
					partNum : todo.partNum,
					completed : todo.completed
				};
				$scope.todo = newTodo;
			});
		})();//auto execute function
	}
	else{
		$scope.todo = todo;
	}
	
	//Set up page configure
	var newPage = {
			curPage : pageService.getPage().curPage,
			pageSize : pageService.getPage().pageSize,
			numberOfPages : pageService.getPage().numberOfPages,
			storeIssues : pageService.getPage().storeIssues || []
	},
	doNewAction = function() {
		var todosList = todoService.getTodolist(),
		newTodoId = todosList.length + 1,
		dueDate = utilService.convertDate($scope.todo.dueDate),
		newTodo = {
			id : isUpdateTodo ? todoId : newTodoId,
			who : $scope.todo.who,
			what : $scope.todo.what,
			dueDate : dueDate,
			partNum : $scope.todo.partNum,
			isCompleted : $scope.todo.completed ? 1 : 0
		};
		
		//Update Todo
		if (isUpdateTodo) {
			todoService.updateTodo(newTodo, function(data, message) {
				alert(message);
				$location.path("/todos");//redirect to todos list page
			});
		}
		else{
			todoService.createTodo(newTodo, function(data, message) {
				alert(message);
				$location.path("/todos");
			});
		}
	};
	
	$scope.upsertTodo = function() {
		doNewAction();
	};
	
	$scope.resetUpsertTodo = function() {
		//Clear Form
		var newTodo = {id : todoId};
		if (isUpdateTodo) {
			newTodo = {};
		}
		$scope.todo = newTodo;
		checkSearchInput();
	};
	
	pageService.setPage(newPage);
});