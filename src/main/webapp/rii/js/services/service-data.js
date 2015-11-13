/********************************************
 ** Author: Pao Im
 ** Email: paoim@yahoo.com
 *********************************************/
var genericDataService = angular.module("genericDataService", ["httpService"]);

genericDataService.service("dataService", function(httpSFService, httpLFService) {
	//private variable
	var baseUrl = "http://localhost:8080/TrackingIssue/rest/",
	
	//private functions
	getBaseUrl = function() {
		return baseUrl;
	},
	setBaseUrl = function(newBaseUrl) {
		baseUrl = newBaseUrl;
	},
	getEntity = function(entity, id, successCallback, errorCallback, isCache) {
		var url = getBaseUrl() + entity + "/" + id;
		//console.log(url);
		if (isCache) {
			httpLFService.doHttpGet(url, successCallback, errorCallback);
		} else {
			httpSFService.doGet(url, successCallback, errorCallback);
		}
	},
	getEntities = function(entity, successCallback, errorCallback, isCache) {
		var url = getBaseUrl() + entity;
		//console.log(url);
		if (isCache) {
			httpLFService.doHttpGet(url, successCallback, errorCallback);
		} else {
			httpSFService.doGet(url, successCallback, errorCallback);
		}
	},
	postEntities = function(entity, data, successCallback, errorCallback, isCache) {
		var url = getBaseUrl() + entity;
		if (isCache) {
			httpLFService.doHttpPost(url, data,  successCallback, errorCallback);
		} else {
			httpSFService.doPost(url, data,  successCallback, errorCallback);
		}
	},
	getEntitiesByPageNo = function(entity, startNo, endNo, successCallback, errorCallback, isCache) {
		var url = getBaseUrl() + entity + "/" + startNo + "/" + endNo;
		//console.log(url);
		if (isCache) {
			httpLFService.doHttpGet(url, successCallback, errorCallback);
		} else {
			httpSFService.doGet(url, successCallback, errorCallback);
		}
	},
	getPhotoByteArray = function(entity, successCallback, errorCallback) {
		var url = getBaseUrl() + entity;
		//console.log(url);
		httpSFService.doGetArrayBuffer(url, successCallback, errorCallback);
	},
	login = function(entity, data, successCallback, errorCallback) {
		var url = getBaseUrl() + entity;
		//console.log(url);
		httpSFService.doPost(url, data,  successCallback, errorCallback);
	},
	createEntity = function(entity, data, successCallback, errorCallback) {
		var url = getBaseUrl() + entity;
		//console.log(url);
		httpSFService.doPost(url, data,  successCallback, errorCallback);
	},
	updateEntity = function(entity, data, successCallback, errorCallback) {
		var url = getBaseUrl() + entity;
		//console.log(url);
		httpSFService.doPut(url, data, successCallback, errorCallback);
	},
	deleteEntity = function(entity, successCallback, errorCallback) {
		var url = getBaseUrl() + entity;
		//console.log(url);
		httpSFService.doDelete(url, successCallback, errorCallback);
	},
	createEntityPost = function(entity, data, successCallback, errorCallback) {
		var url = getBaseUrl() + entity;
		//console.log(url);
		httpLFService.doRequestPost(url, data, successCallback, errorCallback);
	},
	doUploadFilePost = function(entity, requestData, successCallback, errorCallback) {
		var url = getBaseUrl() + entity;
		//console.log(url);
		httpLFService.doXMLUploadFile(url, requestData, successCallback, errorCallback, errorCallback);
	},
	doFilterEntity = function(entity, query) {
		var url = getBaseUrl() + entity;
		//console.log(url);
		return httpSFService.doHttpGet(url, query);
	};
	
	return{
		//public functions
		login : login,
		getEntity : getEntity,
		setBaseUrl : setBaseUrl,
		getEntities : getEntities,
		createEntity : createEntity,
		updateEntity : updateEntity,
		postEntities : postEntities,
		deleteEntity : deleteEntity,
		doFilterEntity : doFilterEntity,
		createEntityPost : createEntityPost,
		doUploadFilePost : doUploadFilePost,
		getPhotoByteArray : getPhotoByteArray,
		getEntitiesByPageNo : getEntitiesByPageNo
	};
});
