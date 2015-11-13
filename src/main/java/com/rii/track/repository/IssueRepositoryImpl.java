package com.rii.track.repository;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.rii.track.model.Issue;
import com.rii.track.util.DateFormatUtil;
import com.rii.track.util.EntityUtil;

@Repository
public class IssueRepositoryImpl implements IssueRepository {

	private SessionFactory sessionFactory;

	@Override
	@Transactional
	public void create(Issue entity) {
		entity.setCreateDate(DateFormatUtil.todayDate());
		getCurrentSession().persist(entity);
	}

	@Override
	@Transactional
	public void update(Issue entity) {
		entity.setUpdateDate(DateFormatUtil.todayDate());
		getCurrentSession().update(entity);
	}

	@Override
	@Transactional
	public void delete(Issue entity) {
		getCurrentSession().delete(entity);
	}

	@Override
	@Transactional
	public void deleteById(long entityId) {
		Issue issue = findOne(entityId);
		if (issue != null) {
			delete(issue);
		}
	}

	@Override
	@Transactional
	public Issue getEntity(String query) {
		Issue issue = new Issue();
		List<Issue> issues = getEntities(query);

		if (EntityUtil.isValidList(issues)) {
			issue = issues.get(0);
		}

		return issue;
	}

	@Override
	@Transactional
	public Issue findOne(long entityId) {
		Issue issue = (Issue) getCurrentSession().get(Issue.class, entityId);

		return issue;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public Issue getLastRow() {
		Issue issue = new Issue();
		List<Issue> issues = getCurrentSession()
				.createSQLQuery(
						"select * from issue iss order by iss.ISSUE_ID Desc limit 1")
				.addEntity(Issue.class).list();

		if (EntityUtil.isValidList(issues)) {
			issue = issues.get(0);
		}

		return issue;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Issue> findByPage(long pageNo, long itemPerPage) {

		return getCurrentSession()
				.createSQLQuery(
						"select * from issue iss order by iss.ISSUE_ID desc limit :offset, :perPage")
				.addEntity(Issue.class).setParameter("offset", pageNo)
				.setParameter("perPage", itemPerPage).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Issue> findAll(boolean isDesc) {
		List<Issue> issues = new ArrayList<Issue>();
		if (isDesc) {
			issues = getCurrentSession()
					.createSQLQuery(
							"select * from issue iss order by iss.ISSUE_ID desc")
					.addEntity(Issue.class).list();
		} else {
			issues = getCurrentSession().createQuery("from Issue").list();
		}

		return issues;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Issue> getEntities(String query) {

		return getCurrentSession()
				.createSQLQuery(
						"select * from issue iss where " + query
								+ " order by iss.ISSUE_ID desc")
				.addEntity(Issue.class).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Issue> reportEntities(String fields, String criteria) {

		return getCurrentSession()
				.createSQLQuery(
						"select " + fields + " from issue iss " + criteria)
				.addEntity(Issue.class).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Issue> getAssignedToList(long contactId) {

		return getCurrentSession()
				.createSQLQuery(
						"select * from issue iss where iss.assignedTo = :assignedTo")
				.addEntity(Issue.class).setParameter("assignedTo", contactId)
				.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Issue> getOpenedByList(long contactId) {

		return getCurrentSession()
				.createSQLQuery(
						"select * from issue iss where iss.openedBy = :openedBy")
				.addEntity(Issue.class).setParameter("openedBy", contactId)
				.list();
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
