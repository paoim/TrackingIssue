/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Priority Service
issueTrackerServices.factory("priorityService", function($rootScope, dataService){
	//private variable
	var priorities = [],
	
	//private functions
	setPriorities = function(newPriorities){
		priorities = [];
		priorities = newPriorities;
	},
	getPriorityByIndex = function(index){
		return priorities[index];
	},
	getPriorityIndex = function(id){
		var index;
		for (var i = 0; i < priorities.length; i++) {
			if (priorities[i].id === id) {
				index = i;
				break;
			}
		}
		return index;
	},
	getPriority = function(id){
		var priority = {};
		for (var i = 0; i < priorities.length; i++) {
			if (priorities[i].id === id) {
				priority = priorities[i];
				break;
			}
		}
		return priority;
	},
	getPriorities = function(){
		return priorities;
	},
	addPriority = function(newPriority){
		priorities.push(newPriority);
	},
	removePriority = function(index){
		priorities.splice(index, 1);
	},
	loadPriorities = function(callbackHandler){
		//dataService.setBaseUrl("http://localhost:8080/TrackingIssue/rest/");
		dataService.getEntities("priorities", function(data){
			var newPriorities = priorities;
			if(data){
				setPriorities(data);
				newPriorities = data;
			}
			
			callbackHandler(newPriorities, "Load Priorities Successfully...");
		},function(error){
			callbackHandler([], "Cannot load Priorities - " + error.message);
		});
		
	},
	loadPrioritiesByPageNo = function(startNo, endNo, callbackHandler){
		dataService.getEntitiesByPageNo("priorities", startNo, endNo, function(data){
			var newPriorities = priorities;
			if(data){
				setPriorities(data);
				newPriorities = data;
			}
			
			callbackHandler(newPriorities, "Load Priorities Successfully...");
		},
		function(error){
			callbackHandler([], "Cannot load Priorities - " + error.message);
		});
		
	},
	loadPriority = function(id, callbackHandler){
		dataService.getEntity("priorities", id, function(data){
			callbackHandler(data, "Load Priority Successfully...");
		},
		function(error){
			callbackHandler({}, "Cannot load Priority - " + error.message);
		});
		
	},
	createPriority = function(priority, callbackHandler){
		delete priority.id;
		dataService.createEntity("priorities/priority", priority, function(data){
			if(data){
				addPriority(data);
				callbackHandler(data, "Create Priority Successfully...");
			}
			
		},
		function(error){
			callbackHandler({}, "Cannot create Priority - " + error.message);
		});
		
	},
	updatePriority = function(priority, callbackHandler){
		dataService.updateEntity("priorities/priority", priority, function(data){
			if(data){
				var index = getPriorityIndex(data.id);
				removePriority(index);
				addPriority(data);
				callbackHandler(data, "Update Priority Successfully...");
			}
			
		},
		function(error){
			callbackHandler({}, "Cannot update Priority - " + error.message);
		});
		
	},
	deletePriority = function(index, callbackHandler){
		var priority = getPriorityByIndex(index);
		
		dataService.deleteEntity("priorities/priority/" + priority.id, function(data){
			removePriority(index);
			callbackHandler(data, "Delete Priority Successfully...");
		},
		function(error){
			callbackHandler({}, "Cannot delete Priority - " + error.message);
		});
		
	},
	uploadPriorityCsv = function(requestData, callbackHandler){
		dataService.doUploadFilePost("priorities/uploadCsv", requestData, function(data){
			if(data){
				callbackHandler(data, "Upload Priorities Successfully...");
			}
			
		},
		function(error){
			callbackHandler([], "Cannot upload Priorities - " + error.message);
		});
	},
	uploadDefaultPriority = function(callbackHandler){
		dataService.getEntities("priorities/default", function(data){
			callbackHandler(data, "Upload Default Priority Successfully...");
		},function(error){
			callbackHandler({}, "Cannot upload default Priority - " + error.message);
		});
		
	};
	
	return{
		//public functions
		getPriority : getPriority,
		addPriority : addPriority,
		loadPriority : loadPriority,
		getPriorities : getPriorities,
		removePriority : removePriority,
		loadPriorities : loadPriorities,
		createPriority : createPriority,
		updatePriority : updatePriority,
		deletePriority : deletePriority,
		uploadPriorityCsv : uploadPriorityCsv,
		getPriorityByIndex : getPriorityByIndex,
		uploadDefaultPriority : uploadDefaultPriority,
		loadPrioritiesByPageNo : loadPrioritiesByPageNo
	};
});