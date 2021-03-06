/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
** Create Date: 07/17/2014
*********************************************/
// Create Historical Fix Service
issueTrackerServices.factory("historicalFixService", function($rootScope, dataService) {
	var historicalFixes = [],
	
	setHistoricalFixes = function(newHistoricalFixes) {
		historicalFixes = [];
		historicalFixes = newHistoricalFixes;
	},
	getHistoricalFixes = function() {
		return historicalFixes;
	},
	getHistoricalFixByIndex = function(index) {
		return historicalFixes[index];
	},
	getHistoricalFixIndex = function(id) {
		var index;
		for (var i = 0; i < historicalFixes.length; i++) {
			if (historicalFixes[i].id === id) {
				index = i;
				break;
			}
		}
		return index;
	},
	getHistoricalFix = function(id) {
		var historicalFix = {};
		for (var i = 0; i < historicalFixes.length; i++) {
			if (historicalFixes[i].id === id) {
				historicalFix = historicalFixes[i];
				break;
			}
		}
		return historicalFix;
	},
	addHistoricalFix = function(newHistoricalFix) {
		historicalFixes.push(newHistoricalFix);
	},
	removeHistoricalFix = function(index) {
		historicalFixes.splice(index, 1);
	},
	loadHistoricalFixes = function(callbackHandler) {
		//dataService.setBaseUrl("http://localhost:8080/TrackingIssue/rest/");
		dataService.getEntities("historicalFixes/getAll", function(data) {
			var newHistoricalFixes = historicalFixes;
			if(data) {
				setHistoricalFixes(data);
				newHistoricalFixes = data;
			}
			
			callbackHandler(newHistoricalFixes, "Load historicalFixes Successfully...");
		},function(error) {
			callbackHandler([], "Cannot load historicalFixes - " + error.message);
		}, true);
		
	},
	loadHistoricalFixesByPageNo = function(starNo, endNo, callbackHandler) {
		dataService.getEntitiesByPageNo("historicalFixes/getPage", starNo, endNo, function(data) {
			var newHistoricalFixes = historicalFixes;
			if(data) {
				setHistoricalFixes(data);
				newHistoricalFixes = data;
			}
			
			callbackHandler(newHistoricalFixes, "Load historicalFixes Successfully...");
		},
		function(error) {
			callbackHandler([], "Cannot load historicalFixes - " + error.message);
		});
		
	},
	loadHistoricalFix = function(id, callbackHandler) {
		dataService.getEntity("historicalFixes/get", id, function(data) {
			callbackHandler(data, "Load historicalFix Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot load historicalFix - " + error.message);
		}, true);
		
	},
	createHistoricalFix = function(historicalFix, callbackHandler) {
		delete historicalFix.id;
		dataService.createEntity("historicalFixes/create", historicalFix, function(data) {
			if(data) {
				addHistoricalFix(data);
				callbackHandler(data, "Create historicalFix Successfully...");
			}
			
		},
		function(error) {
			callbackHandler({}, "Cannot create historicalFix - " + error.message);
		});
		
	},
	updateHistoricalFix = function(historicalFix, callbackHandler) {
		dataService.updateEntity("historicalFixes/update", historicalFix, function(data) {
			if(data) {
				var index = getHistoricalFixIndex(data.id);
				removeHistoricalFix(index);
				addHistoricalFix(data);
				callbackHandler(data, "Update historicalFix Successfully...");
			}
			
		},
		function(error) {
			callbackHandler({}, "Cannot update historicalFix - " + error.message);
		});
		
	},
	deleteHistoricalFix = function(id, callbackHandler) {
		//var historicalFix = getHistoricalFixByIndex(index);
		var index = getHistoricalFixIndex(id);
		
		dataService.deleteEntity("historicalFixes/delete/" + id, function(data) {
			removeHistoricalFix(index);
			callbackHandler(data, "Delete historicalFix Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot delete historicalFix - " + error.message);
		});
		
	},
	uploadHistoricalFixCsv = function(requestData, callbackHandler) {
		dataService.doUploadFilePost("historicalFixes/uploadCsv", requestData, function(data) {
			if(data) {
				callbackHandler(data, "Upload historicalFixes Successfully...");
			}
		},
		function(error) {
			callbackHandler([], "Cannot upload historicalFixes - " + error.message);
		});
	};
	
	
	return {
		getHistoricalFix : getHistoricalFix,
		addHistoricalFix : addHistoricalFix,
		loadHistoricalFix : loadHistoricalFix,
		getHistoricalFixes : getHistoricalFixes,
		setHistoricalFixes : setHistoricalFixes,
		deleteHistoricalFix : deleteHistoricalFix,
		removeHistoricalFix : removeHistoricalFix,
		createHistoricalFix : createHistoricalFix,
		updateHistoricalFix : updateHistoricalFix,
		loadHistoricalFixes : loadHistoricalFixes,
		getHistoricalFixIndex : getHistoricalFixIndex,
		uploadHistoricalFixCsv : uploadHistoricalFixCsv,
		getHistoricalFixByIndex : getHistoricalFixByIndex,
		loadHistoricalFixesByPageNo : loadHistoricalFixesByPageNo
	};
});
