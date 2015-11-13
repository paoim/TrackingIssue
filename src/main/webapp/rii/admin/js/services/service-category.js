/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
// Create Category Service
issueTrackerServices.factory("categoryService", function($rootScope, dataService) {
	// private variable
	var categories = [],
	
	//private functions
	setCategories = function(newCategories) {
		categories = [];
		categories = newCategories;
	},
	getCategory = function(id) {
		var category = {};
		for (var i = 0; i < categories.length; i++) {
			if (categories[i].id === id) {
				category = categories[i];
				break;
			}
		}
		return category;
	},
	getCategoryIndex = function(id) {
		var index;
		for (var i = 0; i < categories.length; i++) {
			if (categories[i].id === id) {
				index = i;
				break;
			}
		}
		return index;
	},
	getCategoryByIndex = function(index) {
		return categories[index];
	},
	getCategories = function() {
		return categories;
	},
	addCategory = function(newCategory) {
		categories.push(newCategory);
	},
	removeCategory = function(index) {
		categories.splice(index, 1);
	},
	loadCategories = function(callbackHandler) {
		//dataService.setBaseUrl("http://localhost:8080/TrackingIssue/rest/");
		dataService.getEntities("categories", function(data) {
			var newCategories = categories;
			if(data) {
				setCategories(data);
				newCategories = data;
			}
			
			callbackHandler(newCategories, "Load Categories Successfully...");
		},function(error) {
			callbackHandler([], "Cannot load Categories - " + error.message);
		}, true);
		
	},
	loadCategoriesByPageNo = function(startNo, endNo, callbackHandler) {
		dataService.getEntitiesByPageNo("categories", startNo, endNo, function(data) {
			var newCategories = categories;
			if(data) {
				setCategories(data);
				newCategories = data;
			}
			
			callbackHandler(newCategories, "Load Categories Successfully...");
		},
		function(error) {
			callbackHandler([], "Cannot load Categories - " + error.message);
		});
		
	},
	loadCategory = function(id, callbackHandler) {
		dataService.getEntity("categories", id, function(data) {
			callbackHandler(data, "Load Category Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot load Category - " + error.message);
		}, true);
		
	},
	createCategory = function(category, callbackHandler) {
		delete category.id;
		dataService.createEntity("categories/category", category, function(data) {
			if(data) {
				addCategory(data);
				callbackHandler(data, "Create Category Successfully...");
			}
			
		},
		function(error) {
			callbackHandler({}, "Cannot create Category - " + error.message);
		});
		
	},
	updateCategory = function(category, callbackHandler) {
		dataService.updateEntity("categories/category", category, function(data) {
			if(data) {
				var index = getCategoryIndex(data.id);
				removeCategory(index);
				addCategory(data);
				callbackHandler(data, "Update Category Successfully...");
			}
			
		},
		function(error) {
			callbackHandler({}, "Cannot update Category - " + error.message);
		});
		
	},
	deleteCategory = function(index, callbackHandler) {
		var category = getCategoryByIndex(index);
		
		dataService.deleteEntity("categories/category/" + category.id, function(data) {
			removeCategory(index);
			callbackHandler(data, "Delete Category Successfully...");
		},
		function(error) {
			callbackHandler({}, "Cannot delete Category - " + error.message);
		});
		
	},
	uploadCategoryCsv = function(requestData, callbackHandler) {
		dataService.doUploadFilePost("categories/uploadCsv", requestData, function(data) {
			if(data) {
				callbackHandler(data, "Upload Categories Successfully...");
			}
			
		},
		function(error) {
			callbackHandler([], "Cannot upload Categories - " + error.message);
		});
	},
	uploadDefaultCategory = function(callbackHandler) {
		dataService.getEntities("categories/default", function(data) {
			callbackHandler(data, "Upload Default Category Successfully...");
		},function(error) {
			callbackHandler({}, "Cannot upload default Category - " + error.message);
		});
		
	};
	
	return{
		//public functions
		getCategory : getCategory,
		addCategory : addCategory,
		loadCategory : loadCategory,
		getCategories : getCategories,
		createCategory : createCategory,
		updateCategory : updateCategory,
		removeCategory : removeCategory,
		deleteCategory : deleteCategory,
		loadCategories : loadCategories,
		uploadCategoryCsv : uploadCategoryCsv,
		getCategoryByIndex : getCategoryByIndex,
		uploadDefaultCategory : uploadDefaultCategory,
		loadCategoriesByPageNo : loadCategoriesByPageNo
	};
});