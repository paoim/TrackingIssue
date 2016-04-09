/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Status Service
issueTrackerServices.factory("statusService", function($rootScope, dataService) {
	//private variable
	var statusItems = [],
	
	//private functions
	setStatusItems = function(newStatusItems) {
		statusItems = [];
		statusItems = newStatusItems;
	},
	getStatusByIndex = function(index) {
		return statusItems[index];
	},
	getStatusIndex = function(id) {
		var index;
		for (var i = 0; i < statusItems.length; i++) {
			if (statusItems[i].id === id) {
				index = i;
				break;
			}
		}
		return index;
	},
	getStatus = function(id) {
		var status = {};
		for (var i = 0; i < statusItems.length; i++) {
			if (statusItems[i].id === id) {
				status = statusItems[i];
				break;
			}
		}
		return status;
	},
	getStatusItems = function() {
		return statusItems;
	},
	addStatus = function(newStatus) {
		statusItems.push(newStatus);
	},
	removeStatus = function(index) {
		statusItems.splice(index, 1);
	},
	loadStatusItems = function(callbackHandler) {
		//dataService.setBaseUrl("http://localhost:8080/TrackingIssue/rest/");
		dataService.getEntities("status/getAll", function(data) {
			var newStatusItems = statusItems;
			if(data) {
				setStatusItems(data);
				newStatusItems = data;
			}
			callbackHandler(newStatusItems, "Load Status Items Successfully...");
		},function(error) {
			callbackHandler([], "Cannot load Status Items - " + error.message);
		}, true);
	},
	loadStatusItemsByPageNo = function(startNo, endNo, callbackHandler) {
		dataService.getEntitiesByPageNo("status/getPage", startNo, endNo, function(data) {
			var newStatusItems = statusItems;
			if(data) {
				setStatusItems(data);
				newStatusItems = data;
			}
			callbackHandler(newStatusItems, "Load Status Items Successfully...");
		},
		function(error) {
			callbackHandler([], "Cannot load Status Items - " + error.message);
		});
	},
	loadStatus = function(id, callbackHandler) {
		dataService.getEntity("status/get", id, function(data) {
			callbackHandler(data, "Load Status Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot load Status - " + error.message);
		}, true);
	},
	createStatus = function(status, callbackHandler) {
		delete status.id;
		dataService.createEntity("status/create", status, function(data) {
			if(data) {
				addStatus(data);
				callbackHandler(data, "Create Status Successfully...");
			}
		},
		function(error) {
			callbackHandler({}, "Cannot create Status - " + error.message);
		});
		
	},
	updateStatus = function(status, callbackHandler) {
		dataService.updateEntity("status/update", status, function(data) {
			if(data) {
				var index = getStatusIndex(data.id);
				removeStatus(index);
				addStatus(data);
				callbackHandler(data, "Update Status Successfully...");
			}
		},
		function(error) {
			callbackHandler({}, "Cannot update Status - " + error.message);
		});
	},
	deleteStatus = function(index, callbackHandler) {
		var status = getStatusByIndex(index);
		
		dataService.deleteEntity("status/delete/" + status.id, function(data) {
			removeStatus(index);
			callbackHandler(data, "Delete Status Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot delete Status - " + error.message);
		});
		
	},
	uploadStatusCsv = function(requestData, callbackHandler) {
		dataService.doUploadFilePost("status/uploadCsv", requestData, function(data) {
			if(data) {
				callbackHandler(data, "Upload Status Successfully...");
			}
		},
		function(error) {
			callbackHandler([], "Cannot upload Status - " + error.message);
		});
	};
	
	return {
		//public functions
		getStatus : getStatus,
		addStatus : addStatus,
		loadStatus : loadStatus,
		createStatus : createStatus,
		updateStatus : updateStatus,
		removeStatus : removeStatus,
		deleteStatus : deleteStatus,
		getStatusItems : getStatusItems,
		loadStatusItems : loadStatusItems,
		uploadStatusCsv : uploadStatusCsv,
		getStatusByIndex : getStatusByIndex,
		loadStatusItemsByPageNo : loadStatusItemsByPageNo
	};
});
