package com.rii.track.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rii.track.model.Photo;
import com.rii.track.repository.CRUDRepository;
import com.rii.track.service.model.PhotoResult;
import com.rii.track.util.ConvertUtil;
import com.rii.track.util.EntityUtil;
import com.rii.track.util.FileUtil;
import com.rii.track.util.PageUtil;

@Service
public class PhotoServiceImpl implements CRUDService<Photo, PhotoResult>,
		PhotoRelatedService {

	private String imageLocation;

	private CRUDRepository<Photo> photoRepository;

	@Override
	public PhotoResult create(Photo entity) {
		photoRepository.create(entity);
		Photo photo = photoRepository.getLastRow();

		return getResult(photo);
	}

	@Override
	public PhotoResult update(Photo entity) {
		photoRepository.update(entity);
		Photo photo = photoRepository.findOne(entity.getId());

		return getResult(photo);
	}

	@Override
	public void delete(Photo entity) {
		photoRepository.delete(entity);
	}

	@Override
	public void deleteById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		if (entityId != -1) {
			photoRepository.deleteById(entityId);
		}
	}

	@Override
	public Photo getLastPhotoByteArray() {
		Photo photo = photoRepository.getLastRow();
		if (EntityUtil.isNullEntity(photo)) {
			photo = new Photo();
		}

		return photo;
	}

	@Override
	public List<Photo> getPhotosByteArray() {
		List<Photo> photoes = photoRepository.findAll(true);
		if (EntityUtil.isEmpltyList(photoes)) {
			photoes = new ArrayList<Photo>();
		}

		return photoes;
	}

	@Override
	public Photo getPhotoByteArray(String id) {
		long entityId = ConvertUtil.getLongId(id);
		Photo photo = photoRepository.findOne(entityId);
		if (EntityUtil.isNullEntity(photo)) {
			photo = new Photo();
		}

		return photo;
	}

	@Override
	public PhotoResult getLastRecord() {
		Photo photo = photoRepository.getLastRow();
		if (EntityUtil.isNullEntity(photo)) {
			photo = new Photo();
		}

		return getResult(photo);
	}

	@Override
	public PhotoResult getById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		Photo photo = photoRepository.findOne(entityId);
		if (EntityUtil.isNullEntity(photo)) {
			photo = new Photo();
		}

		return getResult(photo);
	}

	@Override
	public List<PhotoResult> getAll(String sortDesc) {
		boolean isDesc = Boolean.parseBoolean(sortDesc);
		List<Photo> photoes = photoRepository.findAll(isDesc);
		if (EntityUtil.isEmpltyList(photoes)) {
			photoes = new ArrayList<Photo>();
		}

		return getResults(photoes);
	}

	@Override
	public List<PhotoResult> getEntitiesByPageNo(String pageNo,
			String itemPerPage) {
		long perPage = PageUtil.getItemPerPage(itemPerPage);
		long pageNum = PageUtil.getOffset(pageNo, itemPerPage);
		List<Photo> photoes = photoRepository.findByPage(pageNum, perPage);
		if (EntityUtil.isEmpltyList(photoes)) {
			photoes = new ArrayList<Photo>();
		}

		return getResults(photoes);
	}

	private List<PhotoResult> getResults(List<Photo> photoes) {
		List<PhotoResult> results = new ArrayList<PhotoResult>();
		for (Photo photo : photoes) {
			PhotoResult result = getResult(photo);
			results.add(result);
		}

		return results;
	}

	private PhotoResult getResult(Photo photo) {
		String imageLocation = getImageLocation(photo.getData(),
				photo.getImageName());
		PhotoResult result = ConvertUtil.photoConverter(photo, imageLocation);

		return result;
	}

	private String getImageLocation(byte[] imageData, String imageName) {
		String imageOutputFile = imageLocation
				+ (EntityUtil.isValidString(imageName) ? imageName : "");
		// saveImage(imageData, imageOutputFile);

		return imageOutputFile;
	}

	protected void saveImage(byte[] imageData, String imageOutputFile) {
		try {
			// Delete all files from directory
			FileUtil.cleanDirectory(imageLocation, false);

			// Create output image in specific location
			FileUtil.saveFileByFOS(imageData, imageOutputFile);
		} catch (Exception e) {
			e.printStackTrace();
		}

		// References
		// http://howtodoinjava.com/2013/08/30/hibernate-example-of-insertselect-blob-from-database/
		// http://www.mkyong.com/hibernate/hibernate-save-image-into-database/
		// http://www.java2s.com/Code/Java/Database-SQL-JDBC/InsertpicturetoMySQL.htm
	}

	@Override
	public void uploadExcelContent(InputStream is, String fileName) {

	}

	@Override
	public void saveDafult() {

	}

	@Override
	public String getQuery(Photo entity) {

		return null;
	}

	public void setImageLocation(String imageLocation) {
		this.imageLocation = imageLocation;
	}

	public void setPhotoRepository(CRUDRepository<Photo> photoRepository) {
		this.photoRepository = photoRepository;
	}

}
