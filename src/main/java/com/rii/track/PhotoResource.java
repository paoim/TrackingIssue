package com.rii.track;

import java.io.IOException;
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

import com.rii.track.model.Photo;
import com.rii.track.service.CRUDService;
import com.rii.track.service.PhotoRelatedService;
import com.rii.track.service.model.PhotoResult;
import com.rii.track.util.ConvertUtil;
import com.rii.track.util.FileUtil;

@Path("photo")
@Component
// http://localhost:8080/TrackingIssue/rest/photo
public class PhotoResource {

	private PhotoRelatedService photoRelatedService;

	private CRUDService<Photo, PhotoResult> photoService;

	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Path("uploadCsv")
	public Response uploadCsv(@FormDataParam("file") InputStream is,
			@FormDataParam("file") FormDataContentDisposition fileDetail) {

		photoService.uploadExcelContent(is, fileDetail.getFileName());

		return Response.ok().build();
	}

	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Path("uploadPhoto")
	public Response uploadPhoto(@FormDataParam("file") InputStream is,
			@FormDataParam("file") FormDataContentDisposition fileDetail,
			@FormDataParam("fileId") String fileId,
			@FormDataParam("fileSize") String fileSize) {

		try {
			PhotoResult result = null;
			Photo entity = new Photo();
			long photoId = ConvertUtil.getLongId(fileId);
			// int availableSize = ConvertUtil.getIntId(fileSize);
			byte[] imageData = FileUtil.convertInputStreamToByte_IOUtils(is);
			// byte[] imageData1 =
			// FileUtil.convertInputStreamToByte_PlainJava(is,
			// availableSize);
			// byte[] imageData2 = FileUtil.getBytesFromInputStream(is);

			// System.out.println("imageData1: " + imageData1);
			// System.out.println("imageData2: " + imageData2);
			// System.out.println("imageData: " + imageData);

			entity.setImageName(fileDetail.getFileName());
			entity.setData(imageData);

			if (photoId > 0) {
				entity.setId(photoId);
				result = photoService.update(entity);
			} else {
				result = photoService.create(entity);
			}

			if (result == null) {
				return Response.status(Status.NOT_FOUND).build();
			}

			return Response.ok().entity(result).build();

		} catch (IOException e) {
			e.printStackTrace();
			return Response.status(Status.NOT_FOUND).build();
		}
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	// for input
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	// for output
	@Path("create")
	public Response createPhoto(Photo entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		PhotoResult result = photoService.create(entity);
		if (result == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(result).build();
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("update")
	public Response updatePhoto(Photo entity) {
		if (entity == null) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		PhotoResult result = photoService.update(entity);
		if (result == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(result).build();
	}

	@DELETE
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("delete/{photoId}")
	public Response deletePhoto(@PathParam("photoId") String photoId) {
		if (photoId == null || photoId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		photoService.deleteById(photoId);

		return Response.ok().entity(new Photo()).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("getAll")
	public List<PhotoResult> getAllPhoto() {

		return photoService.getAll("true");
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("getPage/{pageNo}/{itemPerPage}")
	public List<PhotoResult> getPhotoByPageNo(
			@PathParam("pageNo") String pageNo,
			@PathParam("itemPerPage") String itemPerPage) {

		return photoService.getEntitiesByPageNo(pageNo, itemPerPage);
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("get/{photoId}")
	// http:localhost:8080/TrackingIssue/rest/photo/get/1234
	public Response getPhoto(@PathParam("photoId") String photoId) {
		if (photoId == null || photoId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		PhotoResult photo = photoService.getById(photoId);
		if (photo == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(photo).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Path("photo/last")
	public Response getLastPhoto() {
		PhotoResult photo = photoService.getLastRecord();
		if (photo == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return Response.ok().entity(photo).build();
	}

	@GET
	@Produces({ MediaType.APPLICATION_OCTET_STREAM })
	@Path("photo/{photoId}")
	// http:localhost:8080/TrackingIssue/rest/photo/photo/1234
	public Response getByteArrayPhoto(@PathParam("photoId") String photoId) {
		if (photoId == null || photoId.length() < 0) {
			return Response.status(Status.BAD_REQUEST).build();
		}

		Photo photo = photoRelatedService.getPhotoByteArray(photoId);
		if (photo == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return ConvertUtil.getPhotoResponse(photo.getData());
	}

	@GET
	@Produces({ MediaType.APPLICATION_OCTET_STREAM })
	@Path("photo/lastByteArrayPhoto")
	public Response getLastByteArrayPhoto() {
		Photo photo = photoRelatedService.getLastPhotoByteArray();
		if (photo == null) {
			return Response.status(Status.NOT_FOUND).build();
		}

		return ConvertUtil.getPhotoResponse(photo.getData());

		// refeence
		// http://jersey.576304.n2.nabble.com/sending-a-byte-stream-to-client-td3091555.html
	}

	public void setPhotoRelatedService(PhotoRelatedService photoRelatedService) {
		this.photoRelatedService = photoRelatedService;
	}

	public void setPhotoService(CRUDService<Photo, PhotoResult> photoService) {
		this.photoService = photoService;
	}
}
