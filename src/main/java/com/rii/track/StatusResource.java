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

import com.rii.track.service.CRUDService;

@Path("status")
@Component
// http://localhost:8080/TrackingIssue/rest/status
public class StatusResource {

	private CRUDService<com.rii.track.model.Status, com.rii.track.model.Status> statusService;

	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Path("uploadCsv")
	public Response uploadStatusCsv(@FormDataParam("file") InputStream is,
			@FormDataParam("file") FormDataContentDisposition fileDetail) {

		statusService.uploadExcelContent(is, fileDetail.getFileName());

		return Response.ok().build();
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	// for input
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	// for output
	@Path("status")
	public Response createStatus(com.rii.track.model.Status entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		com.rii.track.model.Status status = statusService.create(entity);
		if (status == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(status).build();
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("status")
	public Response updateStatus(com.rii.track.model.Status entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		com.rii.track.model.Status status = statusService.update(entity);
		if (status == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(status).build();
	}

	@DELETE
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("status/{statusId}")
	public Response deleteStatus(@PathParam("statusId") String statusId) {
		if (statusId == null || statusId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		statusService.deleteById(statusId);

		return Response.ok().entity(new com.rii.track.model.Status()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("default")
	public Response saveDafult() {
		statusService.saveDafult();

		return Response.ok().entity(new com.rii.track.model.Status()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<com.rii.track.model.Status> getAllStatus() {

		return statusService.getAll("true");
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("{pageNo}/{itemPerPage}")
	public List<com.rii.track.model.Status> getStatusByPageNo(
			@PathParam("pageNo") String pageNo,
			@PathParam("itemPerPage") String itemPerPage) {

		return statusService.getEntitiesByPageNo(pageNo, itemPerPage);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("{statusId}")
	// http:localhost:8080/TrackingIssue/rest/status/1234
	public Response getStatus(@PathParam("statusId") String statusId) {
		if (statusId == null || statusId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		com.rii.track.model.Status status = statusService.getById(statusId);
		if (status == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(status).build();
	}

	public void setStatusService(
			CRUDService<com.rii.track.model.Status, com.rii.track.model.Status> statusService) {
		this.statusService = statusService;
	}
}
