/********************************************
** Author: Pao Im
** Email: paoim@yahoo.com
*********************************************/
issueTrackerApp.config(function($routeProvider, $locationProvider){
	$routeProvider.
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
	when("/todos",
	{
		controller : "TodoController",
		templateUrl : "view/todo.html"
	}).
	when("/issues/issue/view/:issueId", {
		controller : "IssueDetailController",
		templateUrl : "view/issueDetail.html"
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
	when("/todos/todo/view/:todoId", {
		controller : "TodoDetailController",
		templateUrl : "view/todoDetail.html"
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
		redirectTo : "/issues"
	});
	
	// configure html5 to get links working on jsfiddle
	//$locationProvider.html5Mode(true);
});