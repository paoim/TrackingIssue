/********************************************
 ** Author: Pao Im
 ** Email: paoim@yahoo.com
 *********************************************/
var inputFileModule = angular.module("inputFileModule", []);

inputFileModule.factory("inputFileService", function(){
	var windowUrl = window.URL,
	ngModelFile = "contact.attachment",
	fileSelectorId = "anySelectorId",
	previewSelectorId = "anyPreviewSelectorId",
	previewNoFileSelected = "No file selected!",
	previewInfo = "Click here to select a file!",
	inputFiles = [];
	
	windowUrl = windowUrl || window.webkitURL;
	
	//Set and Get functions
	var setFileSelectorId = function(newFileSelectorId){
		fileSelectorId = newFileSelectorId;
	},
	setPreviewSelectorId = function(newPreviewSelectorId){
		previewSelectorId = newPreviewSelectorId;
	},
	setPreviewInfo = function(newPreviewInfo){
		previewInfo = newPreviewInfo;
	},
	setPreviewNoFileSelected = function(newPreviewNoFileSelected){
		previewNoFileSelected = newPreviewNoFileSelected;
	},
	setNgModelFile = function(newNgModelFile){
		ngModelFile = newNgModelFile;
	},
	getSelectorById = function(selectorId){
		return document.getElementById(selectorId);
	},
	getFileSelector = function(){
		return getSelectorById(fileSelectorId);
	},
	getPreviewSelector = function(){
		return getSelectorById(previewSelectorId);
	},
	getPreviewInfo = function(){
		return previewInfo;
	},
	getPreviewNoFileSelected = function(){
		return previewNoFileSelected;
	},
	getNgModelFile = function(){
		return ngModelFile;
	},
	setInputFiles = function(newInputFiles){
		inputFiles = [];
		inputFiles = newInputFiles;
	},
	getInputFiles = function(){
		return inputFiles;
	},
	displayUploadImage = function(classSelector, files){
		//5 ways to get html elements
		//document.getElementById
		//document.getElementsByTagName
		//document.getElementsByClassName
		//document.getElementsByName
		//document.querySelectorAll
		
		var divClickUpload = document.getElementsByClassName(classSelector);
		if(divClickUpload){
			var imageContainer = document.createElement('div'),
			previewImage = document.createElement('div');
			
			imageContainer.setAttribute("class", "image-container");
			
			if(!files.length){
				previewImage.setAttribute("class", "preview-content");
				previewImage.innerHTML = "<p>" + getPreviewNoFileSelected() + "</p>";
			}
			else{
				var img = document.createElement("img"),
				objectURL = windowUrl.createObjectURL(files[0]);

				img.src = objectURL;
				img.onload = function(e) {
					var realImageUrl = this.src;
					windowUrl.revokeObjectURL(realImageUrl);
				}
				
				previewImage.appendChild(img);
			}
			
			imageContainer.appendChild(previewImage);
			divClickUpload.appendChild(imageContainer);
		}
	},
	
	// Event handlers
	initPreviewSelector = function(){
		var previewSelector = getPreviewSelector();
		
		if(previewSelector){
			previewSelector.innerHTML = "<p>" + getPreviewInfo() + "</p>";
		}
	},
	loadFile = function(){
		var fileSelector = getFileSelector();
		
		if (fileSelector) {
			fileSelector.click();
		}
	},
	getBlobFileUrl = function(files){
		var objectURL = null;
		if(files.length > 0){
			objectURL = windowUrl.createObjectURL(files[0]);
		}
		
		return objectURL;
	},
	handleFile = function(files){
		var previewSelector = getPreviewSelector();
		
		previewSelector.innerHTML = "";
		
		if (!files.length) {
			previewSelector.setAttribute("class", "preview-content");
			previewSelector.innerHTML = "<p>" + getPreviewNoFileSelected() + "</p>";
		} else {
			var img = document.createElement("img"),
			//hiddenFile = document.createElement("input"),
			objectURL = windowUrl.createObjectURL(files[0]);
			
			//hiddenFile.setAttribute("type", "hidden");
			//hiddenFile.setAttribute("id", getNgModelFile());
			//hiddenFile.setAttribute("ng-model", getNgModelFile());
			//hiddenFile.setAttribute("value", objectURL);
			//console.log(objectURL);

			//img.setAttribute("ng-src", objectURL);
			img.src = objectURL;
			//img.height = 100;
			img.onload = function(e) {
				var realImageUrl = this.src;
				//console.log(realImageUrl);
				windowUrl.revokeObjectURL(realImageUrl);
			}
			
			//previewSelector.setAttribute("class", "");
			previewSelector.removeAttribute("class");
			previewSelector.appendChild(img);
			//previewSelector.appendChild(hiddenFile);
		}
	},
	handleFiles = function(files) {
		var previewSelector = getPreviewSelector();
		
		if (!files.length) {
			previewSelector.innerHTML = "<p>No files selected!</p>";
		} else {
			var list = document.createElement("ul");
			for (var i = 0; i < files.length; i++) {
				var li = document.createElement("li");
				list.appendChild(li);

				var img = document.createElement("img");
				img.src = windowUrl.createObjectURL(files[i]);
				img.height = 60;
				img.onload = function(e) {
					windowUrl.revokeObjectURL(this.src);
				}
				li.appendChild(img);

				var info = document.createElement("span");
				info.innerHTML = files[i].name + ": " + files[i].size + " bytes";
				li.appendChild(info);
			}
			
			previewSelector.innerHTML = "";
			previewSelector.appendChild(list);
		}
	},
	
	
	//refactor
	addSelectorEventListener = function(fileSelector, eventName, callbackHandler){
		if (fileSelector.addEventListener) {
			fileSelector.addEventListener(eventName, callbackHandler, false);
		} else if (fileSelector.attachEvent) {
			fileSelector.attachEvent("on" + eventName, callbackHandler);
		}
	},
	removeSelectorEventListener = function(fileSelector, eventName, callbackHandler){
		if (fileSelector.removeEventListener) {
			fileSelector.removeEventListener(eventName, callbackHandler, false);
		} else if (fileSelector.detachEvent) {
			fileSelector.detachEvent("on" + eventName, callbackHandler);
		}
	},
	clearFileInput = function(fileSelector){
		try {
			fileSelector.value = "";
		} catch (ex) {}
		
		if (fileSelector.value) {
			fileSelector.parentNode.replaceChild(fileSelector.cloneNode(true), fileSelector);
		}
	},
	loadFileDialog = function(fileSelector){
		clearFileInput(fileSelector);
		//var callbackHandler = function(){};
		//removeSelectorEventListener(fileSelector, "click", callbackHandler);
		//addSelectorEventListener(fileSelector, "click", callbackHandler);
		fileSelector.click();
	},
	
	addFileSelectedListener = function(fileSelector, callbackHandler){
		//clearFileInput(fileSelector);
		removeSelectorEventListener(fileSelector, "change", callbackHandler);
		addSelectorEventListener(fileSelector, "change", callbackHandler);
	},
	
	//Add listeners
	addSingleFileListener = function(callbackHandler){
		var fileSelector = getFileSelector();
		
		if(fileSelector){
			fileSelector.addEventListener("change", function() {
				var fileList = this.files;
				handleFile(fileList);
				//displayUploadImage("image-box-dashe", fileList);
				callbackHandler(fileList);
			}, false);
		}
	},
	addMultiFileListener = function(){
		var fileSelector = getFileSelector();
		
		if(fileSelector){
			fileSelector.addEventListener("change", function() {
				var fileList = this.files;
				handleFiles(fileList);
			}, false);
		}
	},
	addUploadFileListener = function(callbackHandler){
		var fileSelector = getFileSelector();
		
		if(fileSelector){
			fileSelector.addEventListener("change", function(){
				callbackHandler(this.files);
			}, false);
		}
	};
	
	return{
		loadFile : loadFile,
		handleFile : handleFile,
		handleFiles : handleFiles,
		initPreviewSelector : initPreviewSelector,
		addMultiFileListener : addMultiFileListener,
		addSingleFileListener : addSingleFileListener,
		addUploadFileListener : addUploadFileListener,
		
		getInputFiles : getInputFiles,
		setInputFiles : setInputFiles,
		getNgModelFile : getNgModelFile,
		getBlobFileUrl : getBlobFileUrl,
		getPreviewInfo : getPreviewInfo,
		getSelectorById : getSelectorById,
		getFileSelector : getFileSelector,
		getPreviewSelector : getPreviewSelector,
		getPreviewNoFileSelected : getPreviewNoFileSelected,
		
		setNgModelFile : setNgModelFile,
		setPreviewInfo : setPreviewInfo,
		setFileSelectorId : setFileSelectorId,
		setPreviewSelectorId : setPreviewSelectorId,
		setPreviewNoFileSelected : setPreviewNoFileSelected,
		
		loadFileDialog : loadFileDialog,
		clearFileInput : clearFileInput,
		addFileSelectedListener : addFileSelectedListener
	};
});

//References
// https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications
// http://jsfiddle.net/JeJenny/ZG9re/
// http://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
// http://jsfiddle.net/ZG9re/270/
// http://jsfiddle.net/ZG9re/277/
// http://jsfiddle.net/dirtyd77/LzLcZ/144/