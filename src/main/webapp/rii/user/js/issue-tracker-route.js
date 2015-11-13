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
	when("/issues/issue/view/:issueId",
	{
		controller : "IssueDetailController",
		templateUrl : "view/issueDetail.html"
	}).
	when("/issues/issue/upsert/:issueId",
	{
		controller : "IssueDetailController",
		templateUrl : "view/issueDetail.html"
	}).
	when("/todos", {
		controller : "TodosController",
		templateUrl : "view/todos.html"
	}).
	when("/todos/todo/view/:todoId", {
		controller : "TodoDetailController",
		templateUrl : "view/todoDetail.html"
	}).
	when("/todos/todo/upsert/:todoId", {
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