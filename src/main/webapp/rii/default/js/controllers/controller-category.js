/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
//Create Category Controller
issueTrackerApp.controller("CategoryController", function($scope, $modal, $log, $templateCache, pageService, categoryService, inputFileService){
	var newPage = {
		isDetailPage : false,
		isUploadExcelFile : false,//flag to show or hide upload button
		title : "Categories List",
		createLabel : "New Category",
		createUrl : "categories/newID",
		uploadLabel : "Click to upload Categories",
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	loadCategoryList = function(){
		//Show Animation
		$scope.$emit('LOADPAGE');
		
		//Pagination configure
		$scope.curPage = 0;
		$scope.pageSize = 200;
		$scope.categoriesList = [];
		$scope.numberOfPages = function() {
			return 1;
		};
		
		categoryService.loadCategories(function(categoriesList, message){
			$scope.categoriesList = categoriesList;
			$scope.numberOfPages = function() {
				return Math.ceil($scope.categoriesList.length / $scope.pageSize);
			};
			
			//Hide Animation
			$scope.$emit('UNLOADPAGE');
		});
	};
	
	//Init Data
	loadCategoryList();
	
	//Upload Excel file
	//inputFileService.setFileSelectorId("fileElement");
	var doNewAction = function(){
		//$templateCache.removeAll();//clear cache
		var fileSelector = inputFileService.getSelectorById("fileElement");
		inputFileService.loadFileDialog(fileSelector);
		
		inputFileService.addFileSelectedListener(fileSelector, function(){
			var files = this.files;
			
			if(files && files.length > 0){
				var file = this.files[0],
				fileName = file.name,
				fileSize = parseInt(file.size / 1024),
				requestData = {
					fileId : 0,
					fileRequest : file,
					fileSize : file.size
				};
				console.log("Üpload file's size: " + fileSize + "KB");
				
				categoryService.uploadCategoryCsv(requestData, function(data, message){
					//console.log(data);
					//console.log(message);
					loadCategoryList();
				});
			}
			
			//clear input file after loading file dialog
			inputFileService.clearFileInput(this);
			
		});
		
//		inputFileService.loadFile();
//		inputFileService.addUploadFileListener(function(files){
//			var requestData = {
//				fileId : 0,
//				fileRequest : files[0]
//			};
//			categoryService.uploadCategoryCsv(requestData, function(data, message){
//				//console.log(data);
//				//console.log(message);
//				loadCategoryList();
//			});
//		});
	};
	
	$scope.doDeleteCategory = function(index, size){
		var category = categoryService.getCategoryByIndex(index),
		item = {
				id : category.id,
				index : index,
				confirm : "category"
		},
		modalInstance = $modal.open({
			templateUrl : "view/modalDelete.html",
			controller : ModalDeleteCategoryInstanceCtrl,
			size : size,
			resolve : {
				item : function() {
					return item;
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			$scope.selected = selectedItem;
		}, function() {
			$log.info('Modal for delete Category dismissed at: ' + new Date());
		});
		
		//categoryService.deleteCategory(index, function(data, message){
			//alert(message);
		//});
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
	//$scope.category = categoryService;
});

//Create Category Detail Controller
issueTrackerApp.controller("CategoryDetailController", function($scope, $routeParams, $location, pageService, categoryService, utilService){
	var categoryId = utilService.getId($routeParams.categoryId),
	category = {id : categoryId},
	createLabel = "Save Category",
	isUpdateCategory = false;
	
	//Get Category ID
	if(utilService.isNumber(categoryId)){
		isUpdateCategory = true;
		createLabel = "Update Category";
	}
	
	if(isUpdateCategory){
		(function(){
			categoryService.loadCategory(categoryId, function(category, message){
				$scope.category = category;
			});
		})();//auto execute function
	}
	else{
		$scope.category = category;
	}
	
	var newPage = {
		isDetailPage : true,
		title : "Category Details",
		createLabel : createLabel,
		isDisplaySaveBtn : isUpdateCategory,
		//Keep to store issues
		storeIssues : pageService.getPage().storeIssues || []
	},
	doNewAction = function(){
		var categories = categoryService.getCategories(),
		newCategoryId = categories.length + 1,
		newCategory = {
			id : isUpdateCategory ? categoryId : newCategoryId,
			name : $scope.category.name,
			description : $scope.category.description
		};
		
		//Update Category
		if(isUpdateCategory){
			categoryService.updateCategory(newCategory, function(data, message){
				alert(message);
				$location.path("/categories");//redirect to category page
				//$location.reload();
			});
		}
		else{
			categoryService.createCategory(newCategory, function(data, message){
				alert(message);
				$location.path("/categories");
				//$location.reload();
			});
		}
	};
	
	pageService.setPage(newPage);
	pageService.setClick(doNewAction);
});

var ModalDeleteCategoryInstanceCtrl = function($scope, $modalInstance, item, categoryService) {

	$scope.item = item;

	$scope.ok = function() {
		categoryService.deleteCategory(item.index, function(data, message){
			//alert(message);
			$modalInstance.close(item);
		});
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};