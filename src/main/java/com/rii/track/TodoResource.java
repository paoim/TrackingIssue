package com.rii.track;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.springframework.stereotype.Component;

import com.rii.track.model.Todo;
import com.rii.track.service.CRUDService;
import com.rii.track.service.TodoRelatedService;
import com.rii.track.service.model.HourFilter;
import com.rii.track.service.model.TodoFilter;
import com.rii.track.service.model.TodoResult;
import com.rii.track.util.EmailSMTPUtil;

@Path("todos")
@Component
public class TodoResource {

	private CRUDService<Todo, TodoResult> todoService;

	private TodoRelatedService<Todo, TodoResult> todoRelatedService;

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	// for input
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	// for output
	@Path("todo")
	public Response createTodo(Todo entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		TodoResult result = todoService.create(entity);
		if (result == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(result).build();
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("todo")
	public Response updateTodo(Todo entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		TodoResult result = todoService.update(entity);
		if (result == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(result).build();
	}

	@DELETE
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("todo/{todoId}")
	public Response deleteTodo(@PathParam("todoId") String todoId) {
		if (todoId == null || todoId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		todoService.deleteById(todoId);

		return Response.ok().entity(new Todo()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<TodoResult> getAllTodolist() {

		return todoService.getAll("true");
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("{pageNo}/{itemPerPage}")
	public List<TodoResult> getTodolistByPageNo(
			@PathParam("pageNo") String pageNo,
			@PathParam("itemPerPage") String itemPerPage) {

		return todoService.getEntitiesByPageNo(pageNo, itemPerPage);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("partNum/list/{partNum}")
	public List<TodoResult> getPartNumList(@PathParam("partNum") String partNum) {
		if (partNum == null || partNum.length() < 0) {
			return new ArrayList<TodoResult>();
		}

		return todoRelatedService.getPartNumList(partNum);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("{todoId}")
	// http:localhost:8080/TrackingIssue/rest/todo/1234
	public Response getTodo(@PathParam("todoId") String todoId) {
		if (todoId == null || todoId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		TodoResult todo = todoService.getById(todoId);
		if (todo == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(todo).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("todo/newTodo")
	// http:localhost:8080/TrackingIssue/rest/todo/todo/newTodo
	public Response getLastTodo() {

		TodoResult todo = todoService.getLastRecord();
		if (todo == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(todo).build();
	}

	@POST
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("report")
	public List<TodoResult> report(TodoFilter filter) {
		if (filter == null) {
			return new ArrayList<TodoResult>();
		}

		return todoRelatedService.reportEntities(filter);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("sendMailSSL")
	// http:localhost:8080/TrackingIssue/rest/todo/sendMailSSL
	public Response sendMailSSL() {
		try {
			todoRelatedService.sendMailSSL();
		} catch (Exception e) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}

		return Response.ok().build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("sendMailTLS")
	// http:localhost:8080/TrackingIssue/rest/todo/sendMailTLS
	public Response sendMailTLS() {
		try {
			todoRelatedService.sendMailTLS();
		} catch (Exception e) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}

		return Response.ok().build();
	}

	@POST
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("sendMailToSupervisor")
	// http:localhost:8080/TrackingIssue/rest/todo/sendMailToSupervisor
	public Response sendMailToSupervisor(HourFilter filter) {
		if (filter == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		
		try {
			todoRelatedService.sendAllOpenTasksToSupervisor(filter.toString());
		} catch (Exception e) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}

		return Response.ok().build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("pushMailToSupervisor")
	// http:localhost:8080/TrackingIssue/rest/todo/pushMailToSupervisor
	public Response pushMailToSupervisor() {
		try {
			todoRelatedService.pushToSendAllOpenTasksToSupervisor();
		} catch (Exception e) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}

		return Response.ok().build();
	}

	@POST
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("sendMailToEveryOne")
	// http:localhost:8080/TrackingIssue/rest/todo/sendMailToEveryOne
	public Response sendMailToEveryOne(HourFilter filter) {
		if (filter == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}
		
		try {
			todoRelatedService.sendOpenTasksToEveryOne(filter.toString());
		} catch (Exception e) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}

		return Response.ok().build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("pushMailToEveryOne")
	// http:localhost:8080/TrackingIssue/rest/todo/pushMailToEveryOne
	public Response pushMailToEveryOne() {
		try {
			todoRelatedService.pushToSendOpenTasksToEveryOne();
		} catch (Exception e) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}

		return Response.ok().build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("openTasksEveryone")
	// http:localhost:8080/TrackingIssue/rest/todo/openTasksEveryone
	public List<EmailSMTPUtil> openTasksEveryone() {

		return todoRelatedService.getOpenTasksForEveryOne();
	}

	public void setTodoRelatedService(
			TodoRelatedService<Todo, TodoResult> todoRelatedService) {
		this.todoRelatedService = todoRelatedService;
	}

	public void setTodoService(CRUDService<Todo, TodoResult> todoService) {
		this.todoService = todoService;
	}
}
