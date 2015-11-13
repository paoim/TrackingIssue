/*################################################################################
  Reference: AngularJS v1.2.18
  
  Pao Im (June 2014 - 2014)
  http://pao-profile.appspot.com/

  Normally like to break AngularJS apps into the following folder structure
  at a minimum:

  /default
      /css
      /fonts
      /view
      /js
      	/controllers
      	/directives
      	/services
############################################################################################*/
var issueTrackerApp = angular.module("IssueTrackerApp", [ "ngRoute", "ui.bootstrap", "issueTrackerServices"]);


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
		
		// Check to make we have result
		if(result && isNoProperty) { // (Object.getOwnPropertyNames(result).length === 0) && isNoProperty
			result = items;
		}
		
		return result;
	};
});

// http://jsfiddle.net/carpasse/mcVfK/3/

// http://jsfiddle.net/gy2an/8/

// https://docs.angularjs.org/api/ngRoute/service/$route

// https://angular-ui.github.io/bootstrap/

// https://code.angularjs.org/

// http://www.pretechsol.com/2013/06/java-restful-web-services-simple-example.html#.U62CmkA4SSo

// http://javapostsforlearning.blogspot.com/2013/04/create-restful-web-servicesjax-rs-using.html

// http://www.java2blog.com/2013/04/create-restful-web-servicesjax-rs-using.html

// http://www.vogella.com/tutorials/REST/article.html

// https://docs.angularjs.org/api/ng/filter/filter

// https://docs.angularjs.org/guide/filter

// http://jsfiddle.net/TahmidTanzim/N9Vqk/

// http://jsfiddle.net/2JWb2/5/

// http://css.dzone.com/articles/angularjs-ng-select-and-ng-0

// https://docs.angularjs.org/api/ng/directive/select

// http://jsfiddle.net/LrhAQ/1/

// http://angular-tips.com/blog/2013/08/why-does-angular-dot-js-rock/

// http://www.bennadel.com/blog/2615-posting-form-data-with-http-in-angularjs.htm

// https://docs.angularjs.org/guide/forms

// https://jersey.java.net/nonav/apidocs/1.8/contribs/jersey-spring/com/sun/jersey/spi/spring/container/servlet/package-summary.html

// http://examples.javacodegeeks.com/enterprise-java/spring/jpaorm/spring-hibernate-mysql-and-maven-showcase/

// http://www.webdeveasy.com/angularjs-data-model/

// http://weblogs.asp.net/dwahlin/using-an-angularjs-factory-to-interact-with-a-restful-service

// http://www.javacodegeeks.com/2010/06/spring-3-restful-web-services.html

//Pagination Examples
// http://angulartutorial.blogspot.com/2014/03/client-side-pagination-using-angular-js.html
// http://www.michaelbromley.co.uk/blog/108/paginate-almost-anything-in-angularjs

// Appache Tomcat
//http://www.vogella.com/tutorials/ApacheTomcat/article.html


//Restfull Webservice with jersey:
//http://krishantha.net/notes/restfull-services-in-java-with-jersey-part-3/