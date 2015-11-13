/**************************************************************
 ** Author: Pao Im
 ** Email: paoim@yahoo.com
***************************************************************/
var uploadImageApp = angular.module("uploadImageApp", ["inputFileModule"]);

uploadImageApp.controller("UploadImageCtrl", function($scope) {
	var windowUrl = window.URL,
	fileElem = document.getElementById("fileElem"),
	imagePreview = document.getElementById("imagePreview"),
	dropbox = document.getElementsByClassName("preview-content");
	
	windowUrl = windowUrl || window.webkitURL;

	$scope.loadFile = function() {
		if (fileElem) {
			fileElem.click();
		}
	}

	$scope.handleFiles = function(files) {
		if (!files.length) {
			imagePreview.innerHTML = "<p>No file selected!</p>";
		} else {
			var img = document.createElement("img"),
			objectURL = windowUrl.createObjectURL(files[0]);
			// console.log(objectURL);

			img.src = objectURL;
			img.height = 160;
			img.onload = function(e) {
				var realImageUrl = this.src;
				//console.log(realImageUrl);
				windowUrl.revokeObjectURL(realImageUrl);
			}

			imagePreview.innerHTML = "";
			imagePreview.appendChild(img);
		}
	}

	$scope.dragenter = function(e) {
		e.stopPropagation();
		e.preventDefault();
	}

	$scope.dragover = function(e) {
		e.stopPropagation();
		e.preventDefault();
	}

	$scope.drop = function(e) {
		e.stopPropagation();
		e.preventDefault();

		var dt = e.dataTransfer;
		var files = dt.files;

		$scope.handleFiles(files);
	}

	fileElem.addEventListener("change", function() {
		$scope.handleFiles(this.files);
	}, false);

//	dropbox.addEventListener("dragenter", function(){
//		//console.log(this.event);
//		$scope.dragenter(this.event);
//	}, false);
//	
//	dropbox.addEventListener("dragover", function(){
//		//console.log(this.event);
//		$scope.dragover(this.event);
//	}, false);
//	
//	dropbox.addEventListener("drop", function(){
//		//console.log(this.event);
//		$scope.drop(this.event);
//	}, false);
	
});

uploadImageApp.controller("FileCtrl", function($scope, inputFileService){
	inputFileService.setFileSelectorId("fileElement");
	inputFileService.setPreviewSelectorId("previewImage");
	inputFileService.initPreviewSelector();
	inputFileService.addSingleFileListener();
	
	$scope.openFileDialog = function(){
		inputFileService.loadFile();
	};
});

// https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications