package com.rii.track.repository;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class CRUDRepositoryImpl<T> implements CRUDRepository<T> {

	@Autowired
	SessionFactory sessionFactory;

	private Class<T> clazz;

	public CRUDRepositoryImpl(Class<T> clazz) {
		this.clazz = clazz;
	}

	public void create(T entity) {
		getCurrentSession().persist(entity);
	}

	public void update(T entity) {
		getCurrentSession().merge(entity);
	}

	public void delete(T entity) {
		getCurrentSession().delete(entity);
	}

	public void deleteById(long entityId) {
		T entity = findOne(entityId);
		if (entity != null) {
			delete(entity);
		}
	}

	@SuppressWarnings("unchecked")
	public T findOne(long entityId) {
		T entity = (T) getCurrentSession().get(clazz, entityId);

		return entity;
	}

	@SuppressWarnings({ "unchecked" })
	public List<T> findAll() {
		List<T> entities = getCurrentSession().createQuery(
				"from" + clazz.getName()).list();

		return entities;
	}

	protected final Session getCurrentSession() {
		return sessionFactory.getCurrentSession();
	}
}
