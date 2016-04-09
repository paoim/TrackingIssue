/********************************************
 ** Author: Pao Im
 ** Email: paoim@yahoo.com
 ** Create Date: 07/03/2014
 *********************************************/
// Create Issue Service
issueTrackerServices.factory("issueService", function($rootScope, dataService) {
	var issues = [],

	setIssues = function(newIssues) {
		issues = [];
		issues = newIssues;
	},
	getIssues = function() {
		return issues;
	},
	getIssue = function(id) {
		var issue = {};
		
		for (var i = 0; i < issues.length; i++) {
			if (issues[i].id === id) {
				issue = issues[i];
				break;
			}
		}
		return issue;
	},
	getIssueIndex = function(id) {
		var index;
		for (var i = 0; i < issues.length; i++) {
			if (issues[i].id === id) {
				index = i;
				break;
			}
		}
		return index;
	},
	getIssueByIndex = function(index) {
		return issues[index];
	},
	addIssue = function(newIssue) {
		issues.push(newIssue);
	},
	removeIssue = function(index) {
		issues.splice(index, 1);
	},
	getBriefIssue = function(id, callbackHandler) {
		dataService.getEntity("issues/brief", id, function(data) {
			callbackHandler(data, "Load Issue Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot load Issue - " + error.message);
		}, true);
		
	},
	getPartNum = function(id, callbackHandler) {
		dataService.getEntity("issues/partNum", id, function(data) {
			callbackHandler(data, "Load Issue Part # Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot load Issue Part # - " + error.message);
		}, true);
		
	},
	loadIssue = function(id, callbackHandler) {
		dataService.getEntity("issues/get", id, function(data) {
			callbackHandler(data, "Load Issue Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot load Issue - " + error.message);
		}, true);
		
	},
	loadIssues = function(callbackHandler) {
		//dataService.setBaseUrl("http://localhost:8080/TrackingIssue/rest/");
		dataService.getEntities("issues/getAll", function(data) {
			var newIssues = issues;
			if(data) {
				setIssues(data);
				newIssues = data;
			}
			
			callbackHandler(newIssues, "Load Issues Successfully...");
		},function(error) {
			callbackHandler([], "Cannot load Issues - " + error.message);
		}, true);
		
	},
	loadPartNumIssues = function(partNum, callbackHandler) {
		dataService.getEntity("issues/partNum/list", partNum, function(data) {
			callbackHandler(data, "Load Issues Successfully...");
		},function(error) {
			callbackHandler([], "Cannot load Issues - " + error.message);
		}, true);
		
	},
	loadIssuesByPageNo = function(startNo, endNo, callbackHandler) {
		dataService.getEntitiesByPageNo("issues/getPage", startNo, endNo, function(data) {
			var newIssues = issues;
			if(data) {
				setIssues(data);
				newIssues = data;
			}
			
			callbackHandler(newIssues, "Load Issues Successfully...");
		},
		function(error) {
			callbackHandler([], "Cannot load Issues - " + error.message);
		});
		
	},
	filterIssues = function(query) {
		
		return dataService.doFilterEntity("issues/getSearch", query);
	},
	filterPartNum = function(query) {
		
		return dataService.doFilterEntity("partCustomers/getSearch", query);
	},
	searchPartNum = function(query, callbackHandler) {
		dataService.getEntity("partCustomers/getSearch", query, function(data) {
			callbackHandler(data, "Load Filter PartNum Successfully...");
		},function(error) {
			callbackHandler([], "Cannot load Filter PartNum - " + error.message);
		}, true);
		/*dataService.postEntities("partCustomers/postSearch", query, function(data) {
			callbackHandler(data, "Load Filter PartNum Successfully...");
		},
		function(error) {
			callbackHandler([], "Cannot load Filter PartNum - " + error.message);
		}, true);*/
	},
	searchIssues = function(issueFilter, callbackHandler) {
		/*dataService.getEntity("issues/getSearch", issueFilter, function(data) {
			callbackHandler(data, "Load Search Issues Successfully...");
		},function(error) {
			callbackHandler([], "Cannot load Search Issues - " + error.message);
		}, true);*/
		dataService.postEntities("issues/postSearch", issueFilter, function(data) {
			callbackHandler(data, "Load Search Issues Successfully...");
		},
		function(error) {
			callbackHandler([], "Cannot load Search Issues - " + error.message);
		}, true);
		
	},
	quickPartReport = function(issueFilter, callbackHandler) {
		/*dataService.getEntity("issues/report", criteria, function(data) {
			callbackHandler(data, "Load Quick Parts Successfully...");
		},function(error) {
			callbackHandler([], "Cannot Quick Parts - " + error.message);
		}, true);*/
		dataService.postEntities("issues/report", issueFilter, function(data) {
			callbackHandler(data, "Load Quick Parts Successfully...");
		},
		function(error) {
			callbackHandler([], "Cannot Quick Parts - " + error.message);
		}, true);
		
	},
	createIssue = function(issue, callbackHandler) {
		delete issue.id;
		delete issue.relatedIssues;
		
		dataService.createEntity("issues/create", issue, function(data) {
			if(data) {
				addIssue(data);
				callbackHandler(data, "Create Issue Successfully...");
			}
			
		},
		function(error) {
			callbackHandler({}, "Cannot create Issue - " + error.message);
		});
		
	},
	updateIssue = function(issue, callbackHandler) {
		dataService.updateEntity("issues/update", issue, function(data) {
			if(data) {
				var index = getIssueIndex(data.id);
				removeIssue(index);
				addIssue(data);
				callbackHandler(data, "Update Issue Successfully...");
			}
			
		},
		function(error) {
			callbackHandler({}, "Cannot update Issue - " + error.message);
		});
		
	},
	deleteIssue = function(id, callbackHandler) {
		//var issue = getIssueByIndex(index);
		var index = getIssueIndex(id);
		
		dataService.deleteEntity("issues/delete/" + id, function(data) {
			removeIssue(index);
			callbackHandler(data, "Delete Issue Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot delete Issue - " + error.message);
		});
		
	},
	uploadIssueCsv = function(requestData, callbackHandler) {
		dataService.doUploadFilePost("issues/uploadCsv", requestData, function(data) {
			if(data) {
				callbackHandler(data, "Upload Issues Successfully...");
			}
			
		},
		function(error) {
			callbackHandler([], "Cannot upload Issues - " + error.message);
		});
	},
	updateHistoricalFix = function(callbackHandler) {
		dataService.getEntities("issues/updateHistoricalFix", function(data) {
			callbackHandler(data, "updateHistoricalFix Successfully...");
		},function(error) {
			callbackHandler([], "Cannot updateHistoricalFix - " + error.message);
		});
		
	},
	updateHistoricalProblem = function(callbackHandler) {
		dataService.getEntities("issues/updateHistoricalProblem", function(data) {
			callbackHandler(data, "updateHistoricalProblem Successfully...");
		},function(error) {
			callbackHandler([], "Cannot updateHistoricalProblem - " + error.message);
		});
		
	};

	return {
		getIssue : getIssue,
		addIssue : addIssue,
		setIssues : setIssues,
		getIssues : getIssues,
		loadIssue : loadIssue,
		getPartNum : getPartNum,
		loadIssues : loadIssues,
		createIssue : createIssue,
		updateIssue : updateIssue,
		removeIssue : removeIssue,
		deleteIssue : deleteIssue,
		searchIssues : searchIssues,
		getBriefIssue : getBriefIssue,
		filterIssues : filterIssues,
		filterPartNum : filterPartNum,
		searchPartNum : searchPartNum,
		uploadIssueCsv : uploadIssueCsv,
		getIssueByIndex : getIssueByIndex,
		quickPartReport : quickPartReport,
		loadPartNumIssues : loadPartNumIssues,
		loadIssuesByPageNo : loadIssuesByPageNo,
		updateHistoricalFix : updateHistoricalFix,
		updateHistoricalProblem : updateHistoricalProblem
	};
});
