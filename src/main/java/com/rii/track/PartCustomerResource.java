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

import com.rii.track.model.PartCustomer;
import com.rii.track.service.CRUDService;
import com.rii.track.service.SearchService;
import com.rii.track.service.model.IssueFilter;

@Path("partCustomers")
@Component
public class PartCustomerResource {

	private SearchService<PartCustomer, PartCustomer> searchService;

	private CRUDService<PartCustomer, PartCustomer> partCustomerService;

	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Path("uploadCsv")
	public Response uploadPartCustomerCsv(
			@FormDataParam("file") InputStream is,
			@FormDataParam("file") FormDataContentDisposition fileDetail) {

		partCustomerService.uploadExcelContent(is, fileDetail.getFileName());

		return Response.ok().build();
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	// for input
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	// for output
	@Path("partCustomer")
	public Response createPartCustomer(PartCustomer entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		PartCustomer partCustomer = partCustomerService.create(entity);
		if (partCustomer == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(partCustomer).build();
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("partCustomer")
	public Response updatePartCustomer(PartCustomer entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		PartCustomer partCustomer = partCustomerService.update(entity);
		if (partCustomer == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(partCustomer).build();
	}

	@DELETE
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("partCustomer/{partCustomerId}")
	public Response deletePartCustomer(
			@PathParam("partCustomerId") String partCustomerId) {
		if (partCustomerId == null || partCustomerId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		partCustomerService.deleteById(partCustomerId);

		return Response.ok().entity(new PartCustomer()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("{pageNo}/{itemPerPage}")
	public List<PartCustomer> getPartCustomersByPageNo(
			@PathParam("pageNo") String pageNo,
			@PathParam("itemPerPage") String itemPerPage) {

		return partCustomerService.getEntitiesByPageNo(pageNo, itemPerPage);
	}

	@POST
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("search")
	public List<PartCustomer> filter(IssueFilter filter) {
		if (filter == null) {
			return new ArrayList<PartCustomer>();
		}

		return searchService.search(filter);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<PartCustomer> getAllPartCustomers() {

		return partCustomerService.getAll("true");
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("{partCustomerId}")
	public Response getPartCustomer(
			@PathParam("partCustomerId") String partCustomerId) {
		if (partCustomerId == null || partCustomerId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		PartCustomer partCustomer = partCustomerService.getById(partCustomerId);
		if (partCustomer == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(partCustomer).build();
	}

	public void setSearchService(
			SearchService<PartCustomer, PartCustomer> searchService) {
		this.searchService = searchService;
	}

	public void setPartCustomerService(
			CRUDService<PartCustomer, PartCustomer> partCustomerService) {
		this.partCustomerService = partCustomerService;
	}
}
