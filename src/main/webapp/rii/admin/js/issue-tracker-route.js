/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
// Configure
issueTrackerApp.config(function($routeProvider, $locationProvider) {
	$routeProvider.
	when("/login",
	{
		controller : "LoginController",
		templateUrl : "view/login.html"
	}).
	when("/issues",
	{
		controller : "IssuesController",
		templateUrl : "view/issues.html"
	}).
	when("/contacts",
	{
		controller : "ContactsController",
		templateUrl : "view/contacts.html"
	}).
	when("/categories",
	{
		controller : "CategoryController",
		templateUrl : "view/category.html"
	}).
	when("/status",
	{
		controller : "StatusController",
		templateUrl : "view/status.html"
	}).
	when("/priorities",
	{
		controller : "PriorityController",
		templateUrl : "view/priority.html"
	}).
	when("/historicalProblems",
	{
		controller : "historicalProblemController",
		templateUrl : "view/historicalProblem.html"
	}).
	when("/historicalFixes",
	{
		controller : "historicalFixController",
		templateUrl : "view/historicalFix.html"
	}).
	when("/partCustomers",
	{
		controller : "PartCustomerController",
		templateUrl : "view/partCustomer.html"
	}).
	when("/todos",
	{
		controller : "TodoController",
		templateUrl : "view/todo.html"
	}).
	when("/issues/issue/view/:issueId", {
		controller : "IssueDetailController",
		templateUrl : "view/issueDetail.html"
	}).
	when("/todos/todo/view/:todoId", {
		controller : "TodoDetailController",
		templateUrl : "view/todoDetail.html"
	}).
	when("/contacts/:contactId", {
		controller : "ContactDetailController",
		templateUrl : "view/contactDetail.html"
	}).
	when("/categories/:categoryId", {
		controller : "CategoryDetailController",
		templateUrl : "view/categoryDetail.html"
	}).
	when("/status/:statusId", {
		controller : "StatusDetailController",
		templateUrl : "view/statusDetail.html"
	}).
	when("/priorities/:priorityId", {
		controller : "PriorityDetailController",
		templateUrl : "view/priorityDetail.html"
	}).
	when("/historicalProblems/:historicalProblemId",
	{
		controller : "historicalProblemDetailController",
		templateUrl : "view/historicalProblemDetail.html"
	}).
	when("/historicalFixes/:historicalFixId",
	{
		controller : "historicalFixDetailController",
		templateUrl : "view/historicalFixDetail.html"
	}).
	when("/partCustomers/:partCustomerId", {
		controller : "PartCustomerDetailController",
		templateUrl : "view/partCustomerDetail.html"
	}).
	when("/importData", {
		controller : "ImportDataController",
		templateUrl : "view/importData.html"
	}).
	when("/report", {
		controller : "ReportController",
		templateUrl : "view/report.html"
	}).
	when("/report/issues", {
		controller : "IssueReportController",
		templateUrl : "view/issueReport.html"
	}).
	when("/report/issues/:criteria", {
		controller : "PrintIssueReportController",
		templateUrl : "view/printIssueReport.html"
	}).
	when("/report/todos", {
		controller : "TodoReportController",
		templateUrl : "view/todoReport.html"
	}).
	when("/report/todos/:criteria", {
		controller : "PrintTodoReportController",
		templateUrl : "view/printTodoReport.html"
	}).
	otherwise({
		redirectTo : "login"
	});
	
	// configure html5 to get links working on jsfiddle
	//$locationProvider.html5Mode(true);
});

// Start run
issueTrackerApp.run(function($rootScope, $location, $cookieStore, $http) {
	
	// keep user logged in after page refresh
	$rootScope.riiGlobals = $cookieStore.get('riiGlobals') || {};
	if ($rootScope.riiGlobals.currentUser) {
		$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.riiGlobals.currentUser.authData;
	}
	
	$rootScope.$on('$locationChangeStart', function (event, next, current) {
		// redirect to login page if not logged in
		if ($location.path() !== '/login' && !$rootScope.riiGlobals.currentUser) {
			$location.path('/login');
		}
	});
});