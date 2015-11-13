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

import com.rii.track.model.Category;
import com.rii.track.service.CRUDService;

@Path("categories")
@Component
// http://localhost:8080/TrackingIssue/rest/categories
public class CategoryResource {

	private CRUDService<Category, Category> categoryService;

	@POST
	@Path("uploadCsv")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadCategoryCsv(@FormDataParam("file") InputStream is,
			@FormDataParam("file") FormDataContentDisposition fileDetail) {

		categoryService.uploadExcelContent(is, fileDetail.getFileName());

		return Response.ok().build();
	}

	@POST
	@Path("category")
	@Consumes(MediaType.APPLICATION_JSON)
	// for input
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	// for output
	public Response createCategory(Category entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		Category category = categoryService.create(entity);
		if (category == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(category).build();
	}

	@PUT
	@Path("category")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Response updateCategory(Category entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		Category category = categoryService.update(entity);
		if (category == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(category).build();
	}

	@DELETE
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("category/{categoryId}")
	public Response deleteCategory(@PathParam("categoryId") String categoryId) {
		if (categoryId == null || categoryId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		categoryService.deleteById(categoryId);

		return Response.ok().entity(new Category()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("default")
	public Response saveDafult() {
		categoryService.saveDafult();

		return Response.ok().entity(new Category()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<Category> getAllCategories() {

		return categoryService.getAll("true");
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("{pageNo}/{itemPerPage}")
	public List<Category> getCategoriesByPageNo(
			@PathParam("pageNo") String pageNo,
			@PathParam("itemPerPage") String itemPerPage) {

		return categoryService.getEntitiesByPageNo(pageNo, itemPerPage);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("{categoryId}")
	// http:localhost:8080/TrackingIssue/rest/categories/1234
	public Response getCategory(@PathParam("categoryId") String categoryId) {
		if (categoryId == null || categoryId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		Category category = categoryService.getById(categoryId);
		if (category == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(category).build();
	}

	public void setCategoryService(
			CRUDService<Category, Category> categoryService) {
		this.categoryService = categoryService;
	}
}
