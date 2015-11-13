/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
// Create Contact Service
issueTrackerServices.factory("contactService", function($rootScope, dataService) {
	var contacts = [],
	
	//Private functions
	setContacts = function(newContacts) {
		contacts = [];
		contacts = newContacts;
	},
	getContactByIndex = function(index) {
		return contacts[index];
	},
	getContactIndex = function(id) {
		var index;
		for (var i = 0; i < contacts.length; i++) {
			if (contacts[i].id === id) {
				index = i;
				break;
			}
		}
		return index;
	},
	getContact = function(id) {
		var contact = {};
		for (var i = 0; i < contacts.length; i++) {
			if (contacts[i].id === id) {
				contact = contacts[i];
				break;
			}
		}
		return contact;
	},
	getContacts = function() {
		return contacts;
	},
	addContact = function(newContact) {
		contacts.push(newContact);
	},
	removeContact = function(index) {
		contacts.splice(index, 1);
	},
	loadContacts = function(callbackHandler) {
		//dataService.setBaseUrl("http://localhost:8080/TrackingIssue/rest/");
		dataService.getEntities("contacts", function(data) {
			var newContacts = contacts;
			if(data) {
				setContacts(data);
				newContacts = data;
			}
			
			callbackHandler(newContacts, "Load Contacts Successfully...");
		},function(error) {
			callbackHandler([], "Cannot load Contacts - " + error.message);
		}, true);
		
	},
	loadContactsByPageNo = function(startNo, endNo, callbackHandler) {
		dataService.getEntitiesByPageNo("contacts", startNo, endNo, function(data) {
			var newContacts = contacts;
			if(data) {
				setContacts(data);
				newContacts = data;
			}
			
			callbackHandler(newContacts, "Load Contacts Successfully...");
		},
		function(error) {
			callbackHandler([], "Cannot load Contacts - " + error.message);
		});
		
	},
	loadContact = function(id, callbackHandler) {
		dataService.getEntity("contacts", id, function(data) {
			callbackHandler(data, "Load Contact Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot load Contact - " + error.message);
		}, true);
		
	},
	loadAssignedToList = function(id, callbackHandler) {
		dataService.getEntity("issues/assignedTo", id, function(data) {
			callbackHandler(data, "Load AssignedTo Successfully...");
		},
		function(error) {
			callbackHandler([], "Cannot load AssignedTo - " + error.message);
		}, true);
		
	},
	loadOpenedByList = function(id, callbackHandler) {
		dataService.getEntity("issues/openedBy", id, function(data) {
			callbackHandler(data, "Load OpenedBy Successfully...");
		},
		function(error) {
			callbackHandler([], "Cannot load OpenedBy - " + error.message);
		}, true);
		
	},
	createContact = function(contact, callbackHandler) {
		delete contact.id;
		dataService.createEntity("contacts/contact", contact, function(data) {
			if(data) {
				addContact(data);
				callbackHandler(data, "Create Contact Successfully...");
			}
			
		},
		function(error) {
			callbackHandler({}, "Cannot create Contact - " + error.message);
		});
		
	},
	updateContact = function(contact, callbackHandler) {
		dataService.updateEntity("contacts/contact", contact, function(data) {
			if(data) {
				var index = getContactIndex(data.id);
				removeContact(index);
				addContact(data);
				callbackHandler(data, "Update Contact Successfully...");
			}
			
		},
		function(error) {
			callbackHandler({}, "Cannot update Contact - " + error.message);
		});
		
	},
	deleteContact = function(id, callbackHandler) {
		//var contact = getContactByIndex(index);
		var index = getContactIndex(id);
		
		dataService.deleteEntity("contacts/contact/" + id, function(data) {
			removeContact(index);
			callbackHandler(data, "Delete Contact Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot delete Contact - " + error.message);
		});
		
	},
	createContactPost = function(contact, callbackHandler) {
		delete contact.id;
		dataService.createEntityPost("contacts/contact", contact, function(data) {
			if(data) {
				addContact(data);
				callbackHandler(data, "Create Contact Successfully...");
			}
			
		},
		function(error) {
			callbackHandler({}, "Cannot create Contact - " + error.message);
		});
		
	},
	uploadContactCsv = function(requestData, callbackHandler) {
		dataService.doUploadFilePost("contacts/uploadCsv", requestData, function(data) {
			if(data) {
				callbackHandler(data, "Upload Contacts Successfully...");
			}
			
		},
		function(error) {
			callbackHandler([], "Cannot upload Contacts - " + error.message);
		});
	};
	
	return{
		getContact : getContact,
		addContact : addContact,
		getContacts : getContacts,
		loadContact : loadContact,
		loadContacts : loadContacts,
		updateContact : updateContact,
		deleteContact : deleteContact,
		removeContact : removeContact,
		createContact : createContact,
		loadOpenedByList : loadOpenedByList,
		uploadContactCsv : uploadContactCsv,
		getContactByIndex : getContactByIndex,
		createContactPost : createContactPost,
		loadAssignedToList : loadAssignedToList,
		loadContactsByPageNo : loadContactsByPageNo
	};
});