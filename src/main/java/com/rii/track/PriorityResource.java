package com.rii.track;

import java.io.InputStream;
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

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.stereotype.Component;

import com.rii.track.model.Priority;
import com.rii.track.service.CRUDService;

@Path("priorities")
@Component
// http://localhost:8080/TrackingIssue/rest/priorities
public class PriorityResource {

	private CRUDService<Priority, Priority> priorityService;

	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Path("uploadCsv")
	public Response uploadPriorityCsv(@FormDataParam("file") InputStream is,
			@FormDataParam("file") FormDataContentDisposition fileDetail) {

		priorityService.uploadExcelContent(is, fileDetail.getFileName());

		return Response.ok().build();
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	// for input
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	// for output
	@Path("priority")
	public Response createPriority(Priority entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		Priority priority = priorityService.create(entity);
		if (priority == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(priority).build();
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("priority")
	public Response updatePriority(Priority entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		Priority priority = priorityService.update(entity);
		if (priority == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(priority).build();
	}

	@DELETE
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("priority/{priorityId}")
	public Response deletePriority(@PathParam("priorityId") String priorityId) {
		if (priorityId == null || priorityId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		priorityService.deleteById(priorityId);

		return Response.ok().entity(new Priority()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("default")
	public Response saveDafult() {
		priorityService.saveDafult();

		return Response.ok().entity(new Priority()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<Priority> getAllPriorities() {

		return priorityService.getAll("true");
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("{pageNo}/{itemPerPage}")
	public List<Priority> getPrioritiesByPageNo(
			@PathParam("pageNo") String pageNo,
			@PathParam("itemPerPage") String itemPerPage) {

		return priorityService.getEntitiesByPageNo(pageNo, itemPerPage);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("{priorityId}")
	// http:localhost:8080/TrackingIssue/rest/priorities/1234
	public Response getPriority(@PathParam("priorityId") String priorityId) {
		if (priorityId == null || priorityId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		Priority priority = priorityService.getById(priorityId);
		if (priority == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(priority).build();
	}

	public void setPriorityService(
			CRUDService<Priority, Priority> priorityService) {
		this.priorityService = priorityService;
	}
}
