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

import com.rii.track.model.Contact;
import com.rii.track.service.ContactService;
import com.rii.track.service.model.User;

@Path("contacts")
@Component
// http://localhost:8080/TrackingIssue/rest/contacts
public class ContactResource {

	private ContactService contactService;

	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Path("uploadCsv")
	public Response uploadContactCsv(@FormDataParam("file") InputStream is,
			@FormDataParam("file") FormDataContentDisposition fileDetail) {

		contactService.uploadExcelContent(is, fileDetail.getFileName());

		return Response.ok().build();
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	// for input
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	// for output
	@Path("create")
	public Response createContact(Contact entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		Contact contact = contactService.create(entity);
		if (contact == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(contact).build();
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("login")
	public Response login(User user) {
		if (user == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		Contact contact = contactService.login(user);
		if (contact == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(contact).build();
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("update")
	public Response updateContact(Contact entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		Contact contact = contactService.update(entity);
		if (contact == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(contact).build();
	}

	@DELETE
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("delete/{contactId}")
	public Response deleteContact(@PathParam("contactId") String contactId) {
		if (contactId == null || contactId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		contactService.deleteById(contactId);

		return Response.ok().entity(new Contact()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("getAll")
	public List<Contact> getAllContacts() {

		return contactService.getAll("true");
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("getPage/{pageNo}/{itemPerPage}")
	public List<Contact> getContactsByPageNo(
			@PathParam("pageNo") String pageNo,
			@PathParam("itemPerPage") String itemPerPage) {

		return contactService.getEntitiesByPageNo(pageNo, itemPerPage);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("get/{contactId}")
	// http:localhost:8080/TrackingIssue/rest/contact/1234
	public Response getContact(@PathParam("contactId") String contactId) {
		if (contactId == null || contactId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		Contact contact = contactService.getById(contactId);
		if (contact == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(contact).build();
	}

	public void setContactService(ContactService contactService) {
		this.contactService = contactService;
	}
}
