package com.rii.track.repository;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.rii.track.model.Status;
import com.rii.track.util.DateFormatUtil;
import com.rii.track.util.EntityUtil;

@Repository
public class StatusRepositoryImpl implements CRUDRepository<Status> {

	private SessionFactory sessionFactory;

	@Override
	@Transactional
	public void create(Status entity) {
		entity.setCreateDate(DateFormatUtil.todayDate());
		getCurrentSession().persist(entity);
	}

	@Override
	@Transactional
	public void update(Status entity) {
		entity.setUpdateDate(DateFormatUtil.todayDate());
		getCurrentSession().merge(entity);
	}

	@Override
	@Transactional
	public void delete(Status entity) {
		getCurrentSession().delete(entity);
	}

	@Override
	@Transactional
	public void deleteById(long entityId) {
		Status status = findOne(entityId);
		if (status != null) {
			delete(status);
		}
	}

	@Override
	@Transactional
	public Status getEntity(String query) {
		Status status = new Status();
		List<Status> statusItems = getEntities(query);
		if (EntityUtil.isValidList(statusItems)) {
			status = statusItems.get(0);
		}

		return status;
	}

	@Override
	@Transactional
	public Status findOne(long entityId) {
		Status status = (Status) getCurrentSession()
				.get(Status.class, entityId);

		return status;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public Status getLastRow() {
		Status status = new Status();
		List<Status> statusItems = getCurrentSession()
				.createSQLQuery(
						"select * from status s order by s.STATUS_ID desc limit 1")
				.addEntity(Status.class).list();

		if (EntityUtil.isValidList(statusItems)) {
			status = statusItems.get(0);
		}

		return status;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Status> findByPage(long pageNo, long itemPerPage) {

		return getCurrentSession()
				.createSQLQuery(
						"select * from status s order by s.STATUS_ID desc limit :offset, :perPage")
				.addEntity(Status.class).setParameter("offset", pageNo)
				.setParameter("perPage", itemPerPage).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Status> findAll(boolean isDesc) {
		List<Status> status = new ArrayList<Status>();
		if (isDesc) {
			status = getCurrentSession()
					.createSQLQuery(
							"select * from status s order by s.STATUS_ID desc")
					.addEntity(Status.class).list();
		} else {
			status = getCurrentSession().createQuery("from Status").list();
		}

		return status;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Status> getEntities(String query) {

		return getCurrentSession()
				.createSQLQuery("select * from status s where " + query)
				.addEntity(Status.class).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Status> reportEntities(String fields, String criteria) {

		return getCurrentSession()
				.createSQLQuery(
						"select " + fields + " from status s " + criteria)
				.addEntity(Status.class).list();
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
