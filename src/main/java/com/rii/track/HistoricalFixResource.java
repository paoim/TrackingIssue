package com.rii.track;

import java.io.InputStream;
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

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.stereotype.Component;

import com.rii.track.model.HistoricalFix;
import com.rii.track.service.HistoricalFixService;
import com.rii.track.service.model.HistoricalFixResult;
import com.rii.track.service.model.IssueFilter;

@Path("historicalFixes")
@Component
public class HistoricalFixResource {

	private HistoricalFixService historicalFixService;

	@POST
	@Path("uploadCsv")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadHistoricalFixCsv(
			@FormDataParam("file") InputStream is,
			@FormDataParam("file") FormDataContentDisposition fileDetail) {

		historicalFixService.uploadExcelContent(is, fileDetail.getFileName());

		return Response.ok().build();
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	// for input
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	// for output
	@Path("fix")
	public Response createHistoricalFix(HistoricalFix entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		HistoricalFixResult result = historicalFixService.create(entity);
		if (result == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(result).build();
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("fix")
	public Response updateHistoricalFix(HistoricalFix entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		HistoricalFixResult result = historicalFixService.update(entity);
		if (result == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(result).build();
	}

	@DELETE
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("fix/{historicalFixId}")
	public Response deleteHistoricalFix(
			@PathParam("historicalFixId") String historicalFixId) {
		if (historicalFixId == null || historicalFixId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		historicalFixService.deleteById(historicalFixId);

		return Response.ok().entity(new HistoricalFix()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("{pageNo}/{itemPerPage}")
	public List<HistoricalFixResult> getHistoricalFixesByPageNo(
			@PathParam("pageNo") String pageNo,
			@PathParam("itemPerPage") String itemPerPage) {

		return historicalFixService.getEntitiesByPageNo(pageNo, itemPerPage);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<HistoricalFixResult> getAllHistoricalFixes() {

		return historicalFixService.getAll("true");
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("{historicalFixId}")
	public Response getHistoricalFix(
			@PathParam("historicalFixId") String historicalFixId) {
		if (historicalFixId == null || historicalFixId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		HistoricalFixResult result = historicalFixService
				.getById(historicalFixId);
		if (result == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(result).build();
	}

	@POST
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("report")
	public List<HistoricalFixResult> report(IssueFilter filter) {
		if (filter == null) {
			return new ArrayList<HistoricalFixResult>();
		}

		return historicalFixService.reportEntities(filter);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("issue/list/{issueID}")
	public List<HistoricalFixResult> getIssueList(
			@PathParam("issueID") String issueID) {
		if (issueID == null || issueID.length() < 0) {
			return new ArrayList<HistoricalFixResult>();
		}

		return historicalFixService.getIssueList(issueID);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("partNum/list/{partNum}")
	public List<HistoricalFixResult> getPartNumList(
			@PathParam("partNum") String partNum) {
		if (partNum == null || partNum.length() < 0) {
			return new ArrayList<HistoricalFixResult>();
		}

		return historicalFixService.getPartNumList(partNum);
	}

	public void setHistoricalFixService(
			HistoricalFixService historicalFixService) {
		this.historicalFixService = historicalFixService;
	}
}
