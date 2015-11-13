/*******************************************************************************
 * * Author: Pao Im * Email: paoim@yahoo.com
 ******************************************************************************/
var autocompletionApp = angular.module("autocompletionApp", ["ui.bootstrap"]);

autocompletionApp.controller("MyController", function($scope){
	$scope.myModel = null;
});

autocompletionApp.controller('MyAutocompleteCtrl', [ '$scope', '$http', function($scope, $http) {
	$scope.parts = [];
	$scope.myPart = "";
	$scope.partList = [];
	$scope.locations = [];
	$scope.status = {
		isopen : false
	};
	
	$scope.$watch('asyncSelected', function(val) {
		$http.get('http://maps.googleapis.com/maps/api/geocode/json', {
			params : {
				address : val
			}
		}).then(function(res) {
			$scope.locations.length = 0;
			angular.forEach(res.data.results, function(item) {
				$scope.locations.push(item.formatted_address);
			});
		});
	});
	
	//Get all parts
	(function(){
		var url = "http://localhost:8080/TrackingIssue/rest/partCustomers";
		$http.get(encodeURI(url)).then(function(res) {
			$scope.partList.length = 0;
			angular.forEach(res.data, function(item) {
				$scope.partList.push(item.partNum);
			});
			
			//Remove duplicate items
			if($scope.partList.length > 0){
				var tmp = [];
				for (var i = 0; i < $scope.partList.length; i++) {
					if (tmp.indexOf($scope.partList[i]) == -1) {
						tmp.push($scope.partList[i]);
					}
				}
				
				$scope.partList = tmp;
			}
		});
	})();//auto execute function
	
	$scope.$watch('asyncPartSelected', function(partNum) {
		if(partNum && partNum.length > 3){
			var url = "http://localhost:8080/TrackingIssue/rest/partCustomers/search/PartNum like '" + partNum + "%'";
			$http.get(encodeURI(url)).then(function(res) {
				$scope.parts.length = 0;
				angular.forEach(res.data, function(item) {
					$scope.parts.push(item.partNum);
				});
				
				//Remove duplicate items
				if($scope.parts.length > 0){
					var tmp = [];
					for (var i = 0; i < $scope.parts.length; i++) {
						if (tmp.indexOf($scope.parts[i]) == -1) {
							tmp.push($scope.parts[i]);
						}
					}
					
					$scope.parts = tmp;
				}
			});
		}
	});
	
	$scope.$watch('myPart', function(newValue, oldValue) {
		if(oldValue && newValue && oldValue < newValue && newValue.length > 3){
			$scope.status.isopen = !$scope.status.isopen;
		}
	});

} ]);

autocompletionApp.controller("DropdownCtrl", function($scope) {
	$scope.status = {
		isopen : true
	};
	
	//$scope.$watch("myTestInput", function(val){
		//console.log(val);
		//$scope.status.isopen = !$scope.status.isopen;
	//});
	
	$scope.toggleDropdownTest = function(){
		$scope.status.isopen = !$scope.status.isopen;
	};
	
	$scope.toggleDropdown = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.status.isopen = !$scope.status.isopen;
	};
});

// Create Directive
autocompletionApp.directive('autocomplete', ['$http', function($http) {
	return {
		restrict: "A",
		link: function(scope, element, attrs) {
			element.autocomplete({
				minLength : 3,
				source : function(request, response) {
					var url = "http://localhost:8080/TrackingIssue/rest/partCustomers/search?PartNum=" + request.term;
					$http.get(url).success(function(data) {
						response(data);
					});
				},
				focus : function(event, ui) {
					element.val(ui.item.label);
					return false;
				},
				select : function(event, ui) {
					scope.myModelId.selected = ui.item.value;
					scope.$apply;
					return false;
				},
				change : function(event, ui) {
					if (ui.item === null) {
						scope.myModelId.selected = null;
					}
				}
			}).data("autocomplete")._renderItem = function(ul, item) {
				return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.label + "</a>").appendTo(ul);
			};
		}
	}
}]);