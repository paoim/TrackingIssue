/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
// Create Todo Service
issueTrackerServices.factory("todoService", function($rootScope, dataService) {
	// private variable
	var todolist = [],
	
	//private functions
	setTodolist = function(newTodolist) {
		todolist = [];
		todolist = newTodolist;
	},
	getTodo = function(id) {
		var todo = {};
		for (var i = 0; i < todolist.length; i++) {
			if (todolist[i].id === id) {
				todo = todolist[i];
				break;
			}
		}
		return todo;
	},
	getTodoIndex = function(id) {
		var index;
		for (var i = 0; i < todolist.length; i++) {
			if (todolist[i].id === id) {
				index = i;
				break;
			}
		}
		return index;
	},
	getTodoByIndex = function(index) {
		return todolist[index];
	},
	getTodolist = function() {
		return todolist;
	},
	addTodo = function(newTodo) {
		todolist.push(newTodo);
	},
	removeTodo = function(index) {
		todolist.splice(index, 1);
	},
	getLastTodo = function(callbackHandler) {
		dataService.getEntities("todos/todo/newTodo", function(data) {
			callbackHandler(data, "Load Last Todo Successfully...");
		},function(error) {
			callbackHandler({}, "Cannot load Last Todo - " + error.message);
		});
		
	},
	loadTodolist = function(callbackHandler) {
		//dataService.setBaseUrl("http://localhost:8080/TrackingIssue/rest/");
		dataService.getEntities("todos", function(data) {
			var newTodolist = todolist;
			if(data) {
				setTodolist(data);
				newTodolist = data;
			}
			
			callbackHandler(newTodolist, "Load Todolist Successfully...");
		},function(error) {
			callbackHandler([], "Cannot load Todolist - " + error.message);
		}, true);
		
	},
	loadTodolistByPageNo = function(startNo, endNo, callbackHandler) {
		dataService.getEntitiesByPageNo("todos", startNo, endNo, function(data) {
			var newTodolist = todolist;
			if(data) {
				setTodolist(data);
				newTodolist = data;
			}
			
			callbackHandler(newTodolist, "Load Todolist Successfully...");
		},
		function(error) {
			callbackHandler([], "Cannot load Todolist - " + error.message);
		});
		
	},
	loadTodo = function(id, callbackHandler) {
		dataService.getEntity("todos", id, function(data) {
			var newTodo = data || {};
			callbackHandler(newTodo, "Load Todo Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot load Todo - " + error.message);
		}, true);
		
	},
	loadTodoReport = function(todoFilter, callbackHandler) {
		/*dataService.getEntity("todos/report", criteria, function(data) {
			var newTodos = data || [];
			callbackHandler(newTodos, "Load Todos Successfully...");
		},function(error) {
			callbackHandler([], "Cannot Todos - " + error.message);
		}, true);*/
		dataService.postEntities("todos/report", todoFilter, function(data) {
			var newTodos = data || [];
			callbackHandler(newTodos, "Load Todos Successfully...");
		},
		function(error) {
			callbackHandler([], "Cannot Todos - " + error.message);
		}, true);
		
	},
	loadPartNumTodo = function(partNum, callbackHandler) {
		dataService.getEntity("todos/partNum/list", partNum, function(data) {
			var newTodos = data || [];
			callbackHandler(newTodos, "Load Todos Successfully...");
		},function(error) {
			callbackHandler([], "Cannot load Todos - " + error.message);
		}, true);
		
	},
	sendMailSSL = function(callbackHandler) {
		dataService.getEntities("todos/sendMailSSL", function(data) {
			callbackHandler([], "Send Email by using SSL Successfully...");
		},function(error) {
			callbackHandler([], "Cannot send email by using SSL - " + error.message);
		}, true);
		
	},
	sendMailTLS = function(callbackHandler) {
		dataService.getEntities("todos/sendMailTLS", function(data) {
			callbackHandler([], "Send Email by using TLS Successfully...");
		},function(error) {
			callbackHandler([], "Cannot send email by using TLS - " + error.message);
		}, true);
		
	},
	sendMailToSupervisor = function(callbackHandler) {
		dataService.getEntities("todos/sendMailToSupervisor", function(data) {
			callbackHandler([], "Send Email To Supervisors Successfully...");
		},function(error) {
			callbackHandler([], "Cannot Send Email To Supervisors - " + error.message);
		}, true);
		
	},
	sendMailToEveryOne = function(callbackHandler) {
		dataService.getEntities("todos/sendMailToEveryOne", function(data) {
			callbackHandler([], "Send Email To Everyone Successfully...");
		},function(error) {
			callbackHandler([], "Cannot Send Email To Everyone - " + error.message);
		}, true);
		
	},
	getOpenTasksEveryone = function(callbackHandler) {
		dataService.getEntities("todos/openTasksEveryone", function(data) {
			callbackHandler([], "Get Open Tasks Everyone Successfully...");
		},function(error) {
			callbackHandler([], "Cannot Get Open Tasks Everyone - " + error.message);
		}, true);
		
	},
	createTodo = function(todo, callbackHandler) {
		delete todo.id;
		dataService.createEntity("todos/todo", todo, function(data) {
			if(data) {
				addTodo(data);
				callbackHandler(data, "Create Todo Successfully...");
			}
			
		},
		function(error) {
			callbackHandler({}, "Cannot create Todo - " + error.message);
		});
		
	},
	updateTodo = function(todo, callbackHandler) {
		dataService.updateEntity("todos/todo", todo, function(data) {
			if(data) {
				var index = getTodoIndex(data.id);
				removeTodo(index);
				addTodo(data);
				callbackHandler(data, "Update Todo Successfully...");
			}
			
		},
		function(error) {
			callbackHandler({}, "Cannot update Todo - " + error.message);
		});
		
	},
	deleteTodo = function(id, callbackHandler) {
		var index = getTodoIndex(id);
		
		dataService.deleteEntity("todos/todo/" + id, function(data) {
			removeTodo(index);
			var newTodo = data || {};
			callbackHandler(newTodo, "Delete Todo Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot delete Todo - " + error.message);
		});
		
	},
	loadTodoCustomlist = function(callbackHandler) {
		dataService.getEntities("todos", function(data) {
			var newTodos = data || [];
			callbackHandler(newTodos, "Load Todolist Successfully...");
		},function(error) {
			callbackHandler([], "Cannot load Todolist - " + error.message);
		});
		
	},
	createTodoCustom = function(todo, callbackHandler) {
		delete todo.id;
		dataService.createEntity("todos/todo", todo, function(data) {
			var newTodo = data || {};
			callbackHandler(newTodo, "Create Todo Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot create Todo - " + error.message);
		});
		
	},
	updateTodoCustom = function(todo, callbackHandler) {
		dataService.updateEntity("todos/todo", todo, function(data) {
			var newTodo = data || {};
			callbackHandler(newTodo, "Update Todo Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot update Todo - " + error.message);
		});
		
	},
	deleteTodoCustom = function(id, callbackHandler) {
		dataService.deleteEntity("todos/todo/" + id, function(data) {
			var newTodo = data || {};
			callbackHandler(newTodo, "Delete Todo Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot delete Todo - " + error.message);
		});
		
	},
	uploadTodoCsv = function(requestData, callbackHandler) {
		dataService.doUploadFilePost("todos/uploadCsv", requestData, function(data) {
			var newTodos = data || {};
			callbackHandler(newTodos, "Upload Todolist Successfully...");
		},
		function(error) {
			callbackHandler([], "Cannot upload Todolist - " + error.message);
		});
	};
	
	return {
		//public functions
		getTodo : getTodo,
		addtodo : addTodo,
		loadTodo : loadTodo,
		createTodo : createTodo,
		updateTodo : updateTodo,
		removeTodo : removeTodo,
		deleteTodo : deleteTodo,
		sendMailSSL : sendMailSSL,
		sendMailTLS : sendMailTLS,
		getLastTodo : getLastTodo,
		getTodolist : getTodolist,
		loadTodolist : loadTodolist,
		uploadTodoCsv : uploadTodoCsv,
		loadTodoReport : loadTodoReport,
		getTodoByIndex : getTodoByIndex,
		loadPartNumTodo : loadPartNumTodo,
		createTodoCustom : createTodoCustom,
		updateTodoCustom : updateTodoCustom,
		deleteTodoCustom : deleteTodoCustom,
		loadTodoCustomlist : loadTodoCustomlist,
		sendMailToEveryOne : sendMailToEveryOne,
		loadTodolistByPageNo : loadTodolistByPageNo,
		getOpenTasksEveryone : getOpenTasksEveryone,
		sendMailToSupervisor : sendMailToSupervisor
	};
});
