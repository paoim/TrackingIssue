package com.rii.track.repository;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.rii.track.model.Priority;
import com.rii.track.util.DateFormatUtil;
import com.rii.track.util.EntityUtil;

@Repository
public class PriorityRepositoryImpl implements CRUDRepository<Priority> {

	private SessionFactory sessionFactory;

	@Override
	@Transactional
	public void create(Priority entity) {
		entity.setCreateDate(DateFormatUtil.todayDate());
		getCurrentSession().persist(entity);
	}

	@Override
	@Transactional
	public void update(Priority entity) {
		entity.setUpdateDate(DateFormatUtil.todayDate());
		getCurrentSession().update(entity);
	}

	@Override
	@Transactional
	public void delete(Priority entity) {
		getCurrentSession().delete(entity);
	}

	@Override
	@Transactional
	public void deleteById(long entityId) {
		Priority priority = findOne(entityId);
		if (priority != null) {
			delete(priority);
		}
	}

	@Override
	@Transactional
	public Priority getEntity(String query) {
		Priority priority = new Priority();
		List<Priority> priorities = getEntities(query);
		if (EntityUtil.isValidList(priorities)) {
			priority = priorities.get(0);
		}

		return priority;
	}

	@Override
	@Transactional
	public Priority findOne(long entityId) {
		Priority priority = (Priority) getCurrentSession().get(Priority.class,
				entityId);

		return priority;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public Priority getLastRow() {
		Priority priority = new Priority();
		List<Priority> priorities = getCurrentSession()
				.createSQLQuery(
						"select * from priority p order by p.PRIORITY_ID desc limit 1")
				.addEntity(Priority.class).list();

		if (EntityUtil.isValidList(priorities)) {
			priority = priorities.get(0);
		}

		return priority;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Priority> findByPage(long pageNo, long itemPerPage) {

		return getCurrentSession()
				.createSQLQuery(
						"select * from priority p order by p.PRIORITY_ID desc limit :offset, :perPage")
				.addEntity(Priority.class).setParameter("offset", pageNo)
				.setParameter("perPage", itemPerPage).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Priority> findAll(boolean isDesc) {
		List<Priority> priorities = new ArrayList<Priority>();
		if (isDesc) {
			priorities = getCurrentSession()
					.createSQLQuery(
							"select * from priority p order by p.PRIORITY_ID desc")
					.addEntity(Priority.class).list();
		} else {
			priorities = getCurrentSession().createQuery("from Priority")
					.list();
		}

		return priorities;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Priority> getEntities(String query) {

		return getCurrentSession()
				.createSQLQuery("select * from priority p where " + query)
				.addEntity(Priority.class).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Priority> reportEntities(String fields, String criteria) {

		return getCurrentSession()
				.createSQLQuery(
						"select " + fields + " from priority p " + criteria)
				.addEntity(Priority.class).list();
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
