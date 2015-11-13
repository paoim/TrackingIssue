/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
** Create Date: 07/17/2014
*********************************************/
// Create Historical Problem Service
issueTrackerServices.factory("historicalProblemService", function($rootScope, dataService){
	var historicalProblems = [],
	
	setHistoricalProblems = function(newHistoricalProblems){
		historicalProblems = [];
		historicalProblems = newHistoricalProblems;
	},
	getHistoricalProblems = function(){
		return historicalProblems;
	},
	getHistoricalProblemByIndex = function(index){
		return historicalProblems[index];
	},
	getHistoricalProblemIndex = function(id){
		var index;
		for (var i = 0; i < historicalProblems.length; i++) {
			if (historicalProblems[i].id === id) {
				index = i;
				break;
			}
		}
		return index;
	},
	getHistoricalProblem = function(id){
		var historicalProblem = {};
		for (var i = 0; i < historicalProblems.length; i++) {
			if (historicalProblems[i].id === id) {
				historicalProblem = historicalProblems[i];
				break;
			}
		}
		return historicalProblem;
	},
	addHistoricalProblem = function(newHistoricalProblem){
		historicalProblems.push(newHistoricalProblem);
	},
	removeHistoricalProblem = function(index){
		historicalProblems.splice(index, 1);
	},
	loadHistoricalProblems = function(callbackHandler){
		//dataService.setBaseUrl("http://localhost:8080/TrackingIssue/rest/");
		dataService.getEntities("historicalProblems", function(data){
			var newHistoricalProblems = historicalProblems;
			if(data){
				setHistoricalProblems(data);
				newHistoricalProblems = data;
			}
			
			callbackHandler(newHistoricalProblems, "Load historicalProblems Successfully...");
		},function(error){
			callbackHandler([], "Cannot load historicalProblems - " + error.message);
		});
		
	},
	loadHistoricalProblemsByPageNo = function(starNo, endNo, callbackHandler){
		dataService.getEntitiesByPageNo("historicalProblems", starNo, endNo, function(data){
			var newHistoricalProblems = historicalProblems;
			if(data){
				setHistoricalProblems(data);
				newHistoricalProblems = data;
			}
			
			callbackHandler(newHistoricalProblems, "Load historicalProblems Successfully...");
		},
		function(error){
			callbackHandler([], "Cannot load historicalProblems - " + error.message);
		});
		
	},
	loadHistoricalProblem = function(id, callbackHandler){
		dataService.getEntity("historicalProblems", id, function(data){
			callbackHandler(data, "Load historicalProblem Successfully...");
		},
		function(error){
			callbackHandler({}, "Cannot load historicalProblem - " + error.message);
		});
		
	},
	createHistoricalProblem = function(historicalProblem, callbackHandler){
		delete historicalProblem.id;
		dataService.createEntity("historicalProblems/problem", historicalProblem, function(data){
			if(data){
				addHistoricalProblem(data);
				callbackHandler(data, "Create historicalProblem Successfully...");
			}
			
		},
		function(error){
			callbackHandler({}, "Cannot create historicalProblem - " + error.message);
		});
		
	},
	updateHistoricalProblem = function(historicalProblem, callbackHandler){
		dataService.updateEntity("historicalProblems/problem", historicalProblem, function(data){
			if(data){
				var index = getHistoricalProblemIndex(data.id);
				removeHistoricalProblem(index);
				addHistoricalProblem(data);
				callbackHandler(data, "Update historicalProblem Successfully...");
			}
			
		},
		function(error){
			callbackHandler({}, "Cannot update historicalProblem - " + error.message);
		});
		
	},
	deleteHistoricalProblem = function(id, callbackHandler){
		//var historicalProblem = getHistoricalProblemByIndex(index);
		var index = getHistoricalProblemIndex(id);
		
		dataService.deleteEntity("historicalProblems/problem/" + id, function(data){
			removeHistoricalProblem(index);
			callbackHandler(data, "Delete historicalProblem Successfully...");
		},
		function(error){
			callbackHandler({}, "Cannot delete historicalProblem - " + error.message);
		});
		
	},
	uploadHistoricalProblemCsv = function(requestData, callbackHandler){
		dataService.doUploadFilePost("historicalProblems/uploadCsv", requestData, function(data){
			if(data){
				callbackHandler(data, "Upload historicalProblems Successfully...");
			}
		},
		function(error){
			callbackHandler([], "Cannot upload historicalProblems - " + error.message);
		});
	};
	
	
	return{
		getHistoricalProblem : getHistoricalProblem,
		addHistoricalProblem : addHistoricalProblem,
		loadHistoricalProblem : loadHistoricalProblem,
		getHistoricalProblems : getHistoricalProblems,
		setHistoricalProblems : setHistoricalProblems,
		deleteHistoricalProblem : deleteHistoricalProblem,
		removeHistoricalProblem : removeHistoricalProblem,
		createHistoricalProblem : createHistoricalProblem,
		updateHistoricalProblem : updateHistoricalProblem,
		loadHistoricalProblems : loadHistoricalProblems,
		getHistoricalProblemIndex : getHistoricalProblemIndex,
		uploadHistoricalProblemCsv : uploadHistoricalProblemCsv,
		getHistoricalProblemByIndex : getHistoricalProblemByIndex,
		loadHistoricalProblemsByPageNo : loadHistoricalProblemsByPageNo
	};
});