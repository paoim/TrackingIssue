package com.rii.track.service;

import java.io.InputStream;
import java.util.List;

public interface CRUDService<T, S> {

	void saveDafult();

	S create(T entity);

	S update(T entity);

	void delete(T entity);

	S getLastRecord();

	S getById(String id);

	String getQuery(T entity);

	void deleteById(String id);

	List<S> getAll(String sortDesc);

	void uploadExcelContent(InputStream is, String fileName);

	List<S> getEntitiesByPageNo(String pageNo, String itemPerPage);

}
