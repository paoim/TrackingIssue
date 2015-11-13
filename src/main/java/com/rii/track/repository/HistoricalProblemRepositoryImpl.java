package com.rii.track.repository;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.rii.track.model.HistoricalProblem;
import com.rii.track.util.DateFormatUtil;
import com.rii.track.util.EntityUtil;

@Repository
public class HistoricalProblemRepositoryImpl implements
		HistoricalProblemRepository {

	private SessionFactory sessionFactory;

	@Override
	@Transactional
	public void create(HistoricalProblem entity) {
		entity.setCreateDate(DateFormatUtil.todayDate());
		getCurrentSession().persist(entity);
	}

	@Override
	@Transactional
	public void update(HistoricalProblem entity) {
		entity.setUpdateDate(DateFormatUtil.todayDate());
		getCurrentSession().update(entity);
	}

	@Override
	@Transactional
	public void updateSql(String query) {
		getCurrentSession().createSQLQuery(query).executeUpdate();
	}

	@Override
	@Transactional
	public void delete(HistoricalProblem entity) {
		getCurrentSession().delete(entity);
	}

	@Override
	@Transactional
	public void deleteById(long entityId) {
		HistoricalProblem hp = findOne(entityId);
		if (EntityUtil.isNotNullEntity(hp)) {
			delete(hp);
		}
	}

	@Override
	@Transactional
	public void deleteSql(long entityId) {

		getCurrentSession().createSQLQuery(
				"delete from historical_problem where ISSUE_ID = :issueID")
				.setParameter("issueID", entityId);
	}

	@Override
	@Transactional
	public HistoricalProblem getEntity(String query) {
		HistoricalProblem hp = new HistoricalProblem();
		List<HistoricalProblem> historicalProblems = getEntities(query);
		if (EntityUtil.isValidList(historicalProblems)) {
			hp = historicalProblems.get(0);
		}

		return hp;
	}

	@Override
	@Transactional
	public HistoricalProblem findOne(long entityId) {
		HistoricalProblem hp = (HistoricalProblem) getCurrentSession().get(
				HistoricalProblem.class, entityId);

		return hp;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public HistoricalProblem getLastRow() {
		HistoricalProblem hp = new HistoricalProblem();
		List<HistoricalProblem> historicalProblems = getCurrentSession()
				.createSQLQuery(
						"select * from historical_problem hp order by hp.PROBLEM_ID desc limit 1")
				.addEntity(HistoricalProblem.class).list();

		if (EntityUtil.isValidList(historicalProblems)) {
			hp = historicalProblems.get(0);
		}

		return hp;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<HistoricalProblem> findByPage(long pageNo, long itemPerPage) {

		return getCurrentSession()
				.createSQLQuery(
						"select * from historical_problem hp order by hp.PROBLEM_ID desc limit :offset, perPage")
				.addEntity(HistoricalProblem.class)
				.setParameter("offset", pageNo)
				.setParameter("perPage", itemPerPage).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<HistoricalProblem> findAll(boolean isDesc) {
		List<HistoricalProblem> historicalProblems = new ArrayList<HistoricalProblem>();
		if (isDesc) {
			historicalProblems = getCurrentSession()
					.createSQLQuery(
							"select * from historical_problem hp order by hp.PROBLEM_ID desc")
					.addEntity(HistoricalProblem.class).list();
		} else {
			historicalProblems = getCurrentSession().createQuery(
					"from HistoricalProblem").list();
		}

		return historicalProblems;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<HistoricalProblem> getEntities(String query) {

		return getCurrentSession()
				.createSQLQuery(
						"select * from historical_problem hp where " + query
								+ " order by hp.PROBLEM_ID desc")
				.addEntity(HistoricalProblem.class).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<HistoricalProblem> reportEntities(String fields, String criteria) {

		return getCurrentSession()
				.createSQLQuery(
						"select " + fields + " from historical_problem hp "
								+ criteria).addEntity(HistoricalProblem.class)
				.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<HistoricalProblem> getHistoricalProblems(long issueId,
			String partNumber) {

		return getCurrentSession()
				.createSQLQuery(
						"select * from historical_problem hp where hp.ISSUE_ID = :issueID and hp.partNum = :partNumber order by hp.PROBLEM_ID desc")
				.addEntity(HistoricalProblem.class)
				.setParameter("issueID", issueId)
				.setParameter("partNumber", partNumber).list();
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
