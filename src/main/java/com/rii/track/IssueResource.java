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

import com.rii.track.model.Issue;
import com.rii.track.service.CRUDService;
import com.rii.track.service.IssueRelatedService;
import com.rii.track.service.model.IssueFilter;
import com.rii.track.service.model.IssueResult;

@Path("issues")
@Component
// http://localhost:8080/TrackingIssue/rest/issues
public class IssueResource {

	private CRUDService<Issue, IssueResult> issueService;

	private IssueRelatedService<Issue, IssueResult> issueRelatedService;

	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Path("uploadCsv")
	public Response uploadIssueCsv(@FormDataParam("file") InputStream is,
			@FormDataParam("file") FormDataContentDisposition fileDetail) {

		issueService.uploadExcelContent(is, fileDetail.getFileName());

		return Response.ok().build();
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	// for input
	@Path("create")
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	// for output
	public Response createIssue(Issue entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		IssueResult result = issueService.create(entity);
		if (result == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(result).build();
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("update")
	public Response updateIssue(Issue entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		IssueResult result = issueService.update(entity);
		if (result == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(result).build();
	}

	@DELETE
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("delete/{issueId}")
	public Response deleteIssue(@PathParam("issueId") String issueId) {
		if (issueId == null || issueId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		issueService.deleteById(issueId);

		return Response.ok().entity(new Issue()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("saveDefault")
	public Response saveDafult() {
		issueService.saveDafult();

		return Response.ok().entity(new Issue()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("updateHistoricalFix")
	public Response updatHistoricalFix() {
		issueRelatedService.updateHistoricalFix();

		return Response.ok().entity(new Issue()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("updateHistoricalProblem")
	public Response updatHistoricalProblem() {
		issueRelatedService.updateHistoricalProblem();

		return Response.ok().entity(new Issue()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("getAll")
	public List<IssueResult> getAllIssues() {

		return issueService.getAll("true");
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("get/{pageNo}/{itemPerPage}")
	public List<IssueResult> getIssuesByPageNo(
			@PathParam("pageNo") String pageNo,
			@PathParam("itemPerPage") String itemPerPage) {

		return issueService.getEntitiesByPageNo(pageNo, itemPerPage);
	}

	@POST
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("report")
	public List<IssueResult> report(IssueFilter filter) {
		if (filter == null) {
			return new ArrayList<IssueResult>();
		}

		return issueRelatedService.reportEntities(filter);
	}

	@POST
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("postSearch")
	public List<IssueResult> postSearch(IssueFilter filter) {
		if (filter == null) {
			return new ArrayList<IssueResult>();
		}

		return issueRelatedService.postSearch(filter);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("getSearch/{query}")
	public List<IssueResult> getSearch(@PathParam("query") String query) {
		if (query == null || query.length() < 0) {
			return new ArrayList<IssueResult>();
		}

		return issueRelatedService.getSearch(query);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("assignedTo/{contactId}")
	public List<IssueResult> getAssignedTo(
			@PathParam("contactId") String contactId) {
		if (contactId == null || contactId.length() < 0) {
			return new ArrayList<IssueResult>();
		}

		return issueRelatedService.getAssignedToList(contactId);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("openedBy/{contactId}")
	public List<IssueResult> getOpenedBy(
			@PathParam("contactId") String contactId) {
		if (contactId == null || contactId.length() < 0) {
			return new ArrayList<IssueResult>();
		}

		return issueRelatedService.getOpenedByList(contactId);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("partNum/list/{partNum}")
	public List<IssueResult> getPartNumList(@PathParam("partNum") String partNum) {
		if (partNum == null || partNum.length() < 0) {
			return new ArrayList<IssueResult>();
		}

		return issueRelatedService.getPartNumList(partNum);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("get/{issueId}")
	// http://localhost:8080/TrackingIssue/rest/issues/1234
	public Response getIssue(@PathParam("issueId") String issueId) {
		if (issueId == null || issueId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		IssueResult result = issueService.getById(issueId);
		if (result == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(result).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("partNum/{issueId}")
	public Response getPartNumById(@PathParam("issueId") String issueId) {
		if (issueId == null || issueId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		IssueResult result = issueRelatedService.getPartNumById(issueId);
		if (result == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(result).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("brief/{issueId}")
	public Response getBriefIssueById(@PathParam("issueId") String issueId) {
		if (issueId == null || issueId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		IssueResult result = issueRelatedService.getBriefIssueById(issueId);
		if (result == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(result).build();
	}

	public void setIssueService(CRUDService<Issue, IssueResult> issueService) {
		this.issueService = issueService;
	}

	public void setIssueRelatedService(
			IssueRelatedService<Issue, IssueResult> issueRelatedService) {
		this.issueRelatedService = issueRelatedService;
	}
}
