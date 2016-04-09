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

import com.rii.track.model.HistoricalProblem;
import com.rii.track.service.HistoricalProblemService;
import com.rii.track.service.model.HistoricalProblemResult;
import com.rii.track.service.model.IssueFilter;

@Path("historicalProblems")
@Component
public class HistoricalProblemResource {

	private HistoricalProblemService historicalProblemService;

	@POST
	@Path("uploadCsv")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadHistoricalProblemCsv(
			@FormDataParam("file") InputStream is,
			@FormDataParam("file") FormDataContentDisposition fileDetail) {

		historicalProblemService.uploadExcelContent(is,
				fileDetail.getFileName());

		return Response.ok().build();
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	// for input
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	// for output
	@Path("create")
	public Response createHistoricalProblem(HistoricalProblem entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		HistoricalProblemResult result = historicalProblemService
				.create(entity);
		if (result == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(result).build();
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("update")
	public Response updateHistoricalProblem(HistoricalProblem entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		HistoricalProblemResult result = historicalProblemService
				.update(entity);
		if (result == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(result).build();
	}

	@DELETE
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("delete/{historicalProblemId}")
	public Response deleteHistoricalProblem(
			@PathParam("historicalProblemId") String historicalProblemId) {
		if (historicalProblemId == null || historicalProblemId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		historicalProblemService.deleteById(historicalProblemId);

		return Response.ok().entity(new HistoricalProblem()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("getPage/{pageNo}/{itemPerPage}")
	public List<HistoricalProblemResult> getHistoricalProblemsByPageNo(
			@PathParam("pageNo") String pageNo,
			@PathParam("itemPerPage") String itemPerPage) {

		return historicalProblemService
				.getEntitiesByPageNo(pageNo, itemPerPage);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("getAll")
	public List<HistoricalProblemResult> getAllHistoricalProblems() {

		return historicalProblemService.getAll("true");
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("get/{historicalProblemId}")
	public Response getHistoricalProblem(
			@PathParam("historicalProblemId") String historicalProblemId) {
		if (historicalProblemId == null || historicalProblemId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		HistoricalProblemResult result = historicalProblemService
				.getById(historicalProblemId);
		if (result == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(result).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("updatePartNum")
	// http://localhost:8080/TrackingIssue/rest/historicalProblems/updatePartNum
	public Response updatePartNum() {
		historicalProblemService.updatePartNum();

		return Response.ok().build();
	}

	@POST
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("report")
	public List<HistoricalProblemResult> report(IssueFilter filter) {
		if (filter == null) {
			return new ArrayList<HistoricalProblemResult>();
		}

		return historicalProblemService.reportEntities(filter);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("issue/list/{issueID}")
	public List<HistoricalProblemResult> getIssueList(
			@PathParam("issueID") String issueID) {
		if (issueID == null || issueID.length() < 0) {
			return new ArrayList<HistoricalProblemResult>();
		}

		return historicalProblemService.getIssueList(issueID);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("partNum/list/{partNum}")
	public List<HistoricalProblemResult> getPartNumList(
			@PathParam("partNum") String partNum) {
		if (partNum == null || partNum.length() < 0) {
			return new ArrayList<HistoricalProblemResult>();
		}

		return historicalProblemService.getPartNumList(partNum);
	}

	public void setHistoricalProblemService(
			HistoricalProblemService historicalProblemService) {
		this.historicalProblemService = historicalProblemService;
	}
}
