package com.rii.track.repository;

import java.util.List;

public interface CRUDRepository<T> {

	T getLastRow();

	int getTotalItems();

	void update(T entity);

	void create(T entity);

	void delete(T entity);

	T findOne(long entityId);

	T getEntity(String query);

	List<T> findAll(boolean isDesc);

	void deleteById(long entityId);

	List<T> getEntities(String query);

	List<T> findByPage(long pageNo, long itemPerPage);

	List<T> reportEntities(String fields, String criteria);

}
