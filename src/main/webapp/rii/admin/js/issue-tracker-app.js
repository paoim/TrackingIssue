/*################################################################################
  Reference: AngularJS v1.2.18
  
  Pao Im (June 2014 - 2014)
  http://pao-profile.appspot.com/

  Normally like to break AngularJS apps into the following folder structure
  at a minimum:

  /admin
      /css
      /view
      /js
      	/controllers
      	/directives
      	/services
############################################################################################*/
var issueTrackerApp = angular.module("IssueTrackerApp", [ "ngCookies", "ngRoute", "ui.bootstrap", "issueTrackerServices"]);


issueTrackerApp.filter('paginationFilter', function() {
	return function(input, start) {
		var newInput = input || [];
		
		start = +start;
		return newInput.slice(start);
	};
});


/**
 * Filter Issues by PartNum or Status
 * - When we have PartNum property then filter (search)
 * - When we have Status property then filter it
 */
issueTrackerApp.filter('issueFilter', function() {
	return function(items, filter) {
		// no filter
		if (!filter) {
			return items;
		}
		
		// When filter exists
		var result = {},
		isNoProperty = true;
		angular.forEach(filter, function(filterVal, filterKey) {
			angular.forEach(items, function(item, key) {
				// item.hasOwnProperty(filterKey) or (filterKey in item) - check object as property or not
				if(filterKey in item) {
					isNoProperty = false;
					var fieldVal = item[filterKey];
					if (fieldVal && fieldVal.toLowerCase().indexOf(filterVal.toLowerCase()) > -1) {
						result[key] = item;
					}
				}
			});
		});
		
		// Check to make sure we have result
		if(result && isNoProperty) { // (Object.getOwnPropertyNames(result).length === 0) && isNoProperty
			result = items;
		}
		
		return result;
	};
});