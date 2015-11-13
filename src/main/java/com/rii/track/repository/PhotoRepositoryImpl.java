package com.rii.track.repository;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.rii.track.model.Photo;
import com.rii.track.util.DateFormatUtil;
import com.rii.track.util.EntityUtil;

@Repository
public class PhotoRepositoryImpl implements CRUDRepository<Photo> {

	private SessionFactory sessionFactory;

	@Override
	@Transactional
	public void create(Photo entity) {
		entity.setCreateDate(DateFormatUtil.todayDate());
		getCurrentSession().persist(entity);
	}

	@Override
	@Transactional
	public void update(Photo entity) {
		entity.setUpdateDate(DateFormatUtil.todayDate());
		getCurrentSession().update(entity);
	}

	@Override
	@Transactional
	public void delete(Photo entity) {
		getCurrentSession().delete(entity);
	}

	@Override
	@Transactional
	public void deleteById(long entityId) {
		Photo photo = findOne(entityId);
		if (EntityUtil.isNotNullEntity(photo)) {
			delete(photo);
		}
	}

	@Override
	@Transactional
	public Photo getEntity(String query) {
		Photo photo = new Photo();
		List<Photo> photoes = getEntities(query);
		if (EntityUtil.isValidList(photoes)) {
			photo = photoes.get(0);
		}

		return photo;
	}

	@Override
	@Transactional
	public Photo findOne(long entityId) {
		Photo photo = (Photo) getCurrentSession().get(Photo.class, entityId);

		return photo;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public Photo getLastRow() {
		Photo photo = new Photo();
		List<Photo> photoes = getCurrentSession()
				.createSQLQuery(
						"select * from photo p order by p.PHOTO_ID desc limit 1")
				.addEntity(Photo.class).list();
		if (EntityUtil.isValidList(photoes)) {
			photo = photoes.get(0);
		}

		return photo;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Photo> findByPage(long pageNo, long itemPerPage) {

		return getCurrentSession()
				.createSQLQuery(
						"select * from photo p order by p.PHOTO_ID desc limit :offset, :perPage")
				.addEntity(Photo.class).setParameter("offset", pageNo)
				.setParameter("perPage", itemPerPage).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Photo> findAll(boolean isDesc) {
		List<Photo> photo = new ArrayList<Photo>();
		if (isDesc) {
			photo = getCurrentSession()
					.createSQLQuery(
							"select * from photo p order by p.PHOTO_ID desc")
					.addEntity(Photo.class).list();
		} else {
			photo = getCurrentSession().createQuery("from Photo").list();
		}

		return photo;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Photo> getEntities(String query) {

		return getCurrentSession()
				.createSQLQuery("select * from photo p where " + query)
				.addEntity(Photo.class).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Photo> reportEntities(String fields, String criteria) {

		return getCurrentSession()
				.createSQLQuery(
						"select " + fields + " from photo p " + criteria)
				.addEntity(Photo.class).list();
	}

	@Override
	@Transactional
	public int getTotalItems() {

		return findAll(false).size();
	}

	protected final Session getCurrentSession() {
		return sessionFactory.getCurrentSession();
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

}
