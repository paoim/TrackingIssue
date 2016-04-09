/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
// Create Photo Service
issueTrackerServices.factory("photoService", function($rootScope, dataService) {
	// private variable
	var photoes = [],
	
	//private functions
	setPhotoes = function(newPhotoes) {
		photoes = [];
		photoes = newPhotoes;
	},
	getPhoto = function(id) {
		var photo = {};
		for (var i = 0; i < photoes.length; i++) {
			if (photoes[i].id === id) {
				photo = photoes[i];
				break;
			}
		}
		return photo;
	},
	getPhotoIndex = function(id) {
		var index;
		for (var i = 0; i < photoes.length; i++) {
			if (photoes[i].id === id) {
				index = i;
				break;
			}
		}
		return index;
	},
	getPhotoByIndex = function(index) {
		return photoes[index];
	},
	getPhotoes = function() {
		return photoes;
	},
	addPhoto = function(newPhoto) {
		photoes.push(newPhoto);
	},
	removePhoto = function(index) {
		photoes.splice(index, 1);
	},
	loadPhotoes = function(callbackHandler) {
		//dataService.setBaseUrl("http://localhost:8080/TrackingIssue/rest/");
		dataService.getEntities("photo/getAll", function(data) {
			var newPhotoes = photoes;
			if(data) {
				setPhotoes(data);
				newPhotoes = data;
			}
			
			callbackHandler(newPhotoes, "Load Photoes Successfully...");
		},function(error) {
			callbackHandler([], "Cannot load Photoes - " + error.message);
		});
		
	},
	loadPhotoesByPageNo = function(startNo, endNo, callbackHandler) {
		dataService.getEntitiesByPageNo("photo/getPage", startNo, endNo, function(data) {
			var newPhotoes = photoes;
			if(data) {
				setPhotoes(data);
				newPhotoes = data;
			}
			
			callbackHandler(newPhotoes, "Load Photoes Successfully...");
		},
		function(error) {
			callbackHandler([], "Cannot load Photoes - " + error.message);
		});
		
	},
	loadPhoto = function(id, callbackHandler) {
		dataService.getEntity("photo/get", id, function(data) {
			callbackHandler(data, "Load Photo Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot load Photo - " + error.message);
		});
		
	},
	getLastPhoto = function(callbackHandler) {
		dataService.getEntities("photo/photo/last", function(data) {
			callbackHandler(data, "Load Last Photo Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot load Last Photo - " + error.message);
		});
		
	},
	getByteArrayPhoto = function(id, callbackHandler) {
		dataService.getPhotoByteArray("photo/photo/" + id, function(data) {
			callbackHandler(data, "Load Photo Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot load Photo - " + error.message);
		});
		
	},
	getLastByteArrayPhoto = function(callbackHandler) {
		dataService.getPhotoByteArray("photo/photo/lastByteArrayPhoto", function(data) {
			callbackHandler(data, "Load Last Photo Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot load Last Photo - " + error.message);
		});
		
	},
	createPhoto = function(photo, callbackHandler) {
		delete photo.id;
		dataService.createEntity("photo/create", photo, function(data) {
			if(data) {
				addPhoto(data);
				callbackHandler(data, "Create Photo Successfully...");
			}
			
		},
		function(error) {
			callbackHandler({}, "Cannot create Photo - " + error.message);
		});
		
	},
	updatePhoto = function(photo, callbackHandler) {
		dataService.updateEntity("photo/update", photo, function(data) {
			if(data) {
				var index = getPhotoIndex(data.id);
				removePhoto(index);
				addPhoto(data);
				callbackHandler(data, "Update Photo Successfully...");
			}
			
		},
		function(error) {
			callbackHandler({}, "Cannot update Photo - " + error.message);
		});
		
	},
	deletePhoto = function(index, callbackHandler) {
		var photo = getPhotoByIndex(index);
		
		dataService.deleteEntity("photo/delete/" + photo.id, function(data) {
			removePhoto(index);
			callbackHandler(data, "Delete Photo Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot delete Photo - " + error.message);
		});
		
	},
	uploadCsv = function(requestData, callbackHandler) {
		dataService.doUploadFilePost("photo/uploadCsv", requestData, function(data) {
			if(data) {
				callbackHandler(data, "Upload Photoes Successfully...");
			}
			
		},
		function(error) {
			callbackHandler([], "Cannot upload Photoes - " + error.message);
		});
	},
	uploadPhoto = function(requestData, callbackHandler) {
		dataService.doUploadFilePost("photo/uploadPhoto", requestData, function(data) {
			if(data) {
				callbackHandler(data, "Upload Photo Successfully...");
			}
			
		},
		function(error) {
			callbackHandler([], "Cannot upload Photo - " + error.message);
		});
	};
	
	return {
		//public functions
		getPhoto : getPhoto,
		addPhoto : addPhoto,
		loadPhoto : loadPhoto,
		uploadCsv : uploadCsv,
		getPhotoes : getPhotoes,
		createPhoto : createPhoto,
		updatePhoto : updatePhoto,
		removePhoto : removePhoto,
		deletePhoto : deletePhoto,
		loadPhotoes : loadPhotoes,
		uploadPhoto : uploadPhoto,
		getLastPhoto : getLastPhoto,
		getPhotoByIndex : getPhotoByIndex,
		getByteArrayPhoto : getByteArrayPhoto,
		loadPhotoesByPageNo : loadPhotoesByPageNo,
		getLastByteArrayPhoto : getLastByteArrayPhoto
	};
});
