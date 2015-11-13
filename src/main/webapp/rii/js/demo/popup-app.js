/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
var popupApp = angular.module("popupApp", []);

popupApp.controller('DemoController', function($scope) {
	$scope.selected = {};
	$scope.items = [ {
		id : 1,
		partNum: '1234',
		custName : 'ABC',
		issues : [
		            {
		            	issueId : 1
		            },
		            {
		            	issueId : 2
		            },
		            {
		            	issueId : 3
		            },
		            ]
	}, {
		id : 2,
		partNum: '3234',
		custName : 'Bac',
		issues : [
		            {
		            	issueId : 12
		            },
		            {
		            	issueId : 22
		            },
		            {
		            	issueId : 33
		            },
		            ]
	}, {
		id : 3,
		partNum: '3244',
		custName : 'Hello',
		issues : [
		            {
		            	issueId : 122
		            },
		            {
		            	issueId : 222
		            },
		            {
		            	issueId : 332
		            },
		            ]
	} ];
});

popupApp.controller('TestController', function($scope) {
	$scope.isDisplay = false;
	$scope.issuesByPartNum = [];
	$scope.$watch("todo.partNum", function(partNum){
        if(partNum && partNum.length > 3){
            for(var i=1; i < 6; i++){
                var issueByPartNum = {
                    id : i,
                    partNum : '123' + i
                };
                $scope.issuesByPartNum.push(issueByPartNum);
                $scope.isDisplay = true;
            }
        } 
    });
	
	$scope.getPartNum = function() {
		//console.log($scope.partNumSelected);
		$scope.todo.partNum = $scope.partNumSelected.partNum;
		$scope.isDisplay = false;
	};
});