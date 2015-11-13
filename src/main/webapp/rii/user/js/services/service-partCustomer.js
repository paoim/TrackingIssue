/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create PartCustomer Service
issueTrackerServices.factory("partCustomerService", function($rootScope, dataService){
	//private variable
	var partCustomers = [],
	
	//private functions
	setPartCustomers = function(newPartCustomers){
		partCustomers = [];
		partCustomers = newPartCustomers;
	},
	getPartCustomerByIndex = function(index){
		return partCustomers[index];
	},
	getPartCustomerIndex = function(id){
		var index;
		for (var i = 0; i < partCustomers.length; i++) {
			if (partCustomers[i].id === id) {
				index = i;
				break;
			}
		}
		return index;
	},
	getPartCustomer = function(id){
		var partCustomer = {};
		for (var i = 0; i < partCustomers.length; i++) {
			if (partCustomers[i].id === id) {
				partCustomer = partCustomers[i];
				break;
			}
		}
		return partCustomer;
	},
	getPartCustomers = function(){
		return partCustomers;
	},
	addPartCustomer = function(newPartCustomter){
		partCustomers.push(newPartCustomter);
	},
	removePartCustomer = function(index){
		partCustomers.splice(index, 1);
	},
	loadPartCustomers = function(callbackHandler){
		//dataService.setBaseUrl("http://localhost:8080/TrackingIssue/rest/");
		dataService.getEntities("partCustomers", function(data){
			var newPartCustomers = partCustomers;
			if(data){
				setPartCustomers(data);
				newPartCustomers = data;
			}
			
			callbackHandler(newPartCustomers, "Load PartCustomers Successfully...");
		},function(error){
			callbackHandler([], "Cannot load PartCustomers - " + error.message);
		});
		
	},
	loadPartCustomersByPageNo = function(starNo, endNo, callbackHandler){
		dataService.getEntitiesByPageNo("partCustomers", starNo, endNo, function(data){
			var newPartCustomers = partCustomers;
			if(data){
				setPartCustomers(data);
				newPartCustomers = data;
			}
			
			callbackHandler(newPartCustomers, "Load PartCustomers Successfully...");
		},
		function(error){
			callbackHandler([], "Cannot load PartCustomers - " + error.message);
		});
		
	},
	loadPartCustomer = function(id, callbackHandler){
		dataService.getEntity("partCustomers", id, function(data){
			callbackHandler(data, "Load PartCustomer Successfully...");
		},
		function(error){
			callbackHandler({}, "Cannot load PartCustomer - " + error.message);
		});
		
	},
	createPartCustomer = function(partCustomer, callbackHandler){
		delete partCustomer.id;
		dataService.createEntity("partCustomers/partCustomer", partCustomer, function(data){
			if(data){
				addPartCustomer(data);
				callbackHandler(data, "Create PartCustomer Successfully...");
			}
			
		},
		function(error){
			callbackHandler({}, "Cannot create PartCustomer - " + error.message);
		});
		
	},
	updatePartCustomer = function(partCustomer, callbackHandler){
		dataService.updateEntity("partCustomers/partCustomer", partCustomer, function(data){
			if(data){
				var index = getPartCustomerIndex(data.id);
				removePartCustomer(index);
				addPartCustomer(data);
				callbackHandler(data, "Update PartCustomer Successfully...");
			}
			
		},
		function(error){
			callbackHandler({}, "Cannot update PartCustomer - " + error.message);
		});
		
	},
	deletePartCustomer = function(id, callbackHandler){
		dataService.deleteEntity("partCustomers/partCustomer/" + id, function(data){
			var index = getPartCustomerIndex(id);
			removePartCustomer(index);
			callbackHandler(data, "Delete PartCustomer Successfully...");
		},
		function(error){
			callbackHandler({}, "Cannot delete PartCustomer - " + error.message);
		});
		
	},
	uploadPartCustomerCsv = function(requestData, callbackHandler){
		dataService.doUploadFilePost("partCustomers/uploadCsv", requestData, function(data){
			if(data){
				callbackHandler(data, "Upload PartCustomer Successfully...");
			}
			
		},
		function(error){
			callbackHandler({}, "Cannot upload PartCustomer - " + error.message);
		});
	};
	
	return{
		//public functions
		getPartCustomer : getPartCustomer,
		addPartCustomer : addPartCustomer,
		getPartCustomers : getPartCustomers,
		getPartCustomerByIndex : getPartCustomerByIndex,
		removePartCustomer : removePartCustomer,
		loadPartCustomersByPageNo : loadPartCustomersByPageNo,
		loadPartCustomers : loadPartCustomers,
		loadPartCustomer : loadPartCustomer,
		createPartCustomer : createPartCustomer,
		updatePartCustomer : updatePartCustomer,
		deletePartCustomer : deletePartCustomer,
		uploadPartCustomerCsv : uploadPartCustomerCsv
	};
});