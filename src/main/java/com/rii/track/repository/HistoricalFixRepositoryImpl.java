package com.rii.track.repository;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.rii.track.model.HistoricalFix;
import com.rii.track.util.DateFormatUtil;
import com.rii.track.util.EntityUtil;

@Repository
public class HistoricalFixRepositoryImpl implements HistoricalFixRepository {

	private SessionFactory sessionFactory;

	@Override
	@Transactional
	public void create(HistoricalFix entity) {
		entity.setCreateDate(DateFormatUtil.todayDate());
		getCurrentSession().persist(entity);
	}

	@Override
	@Transactional
	public void update(HistoricalFix entity) {
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
	public void delete(HistoricalFix entity) {
		getCurrentSession().delete(entity);
	}

	@Override
	@Transactional
	public void deleteById(long entityId) {
		HistoricalFix hf = findOne(entityId);
		if (EntityUtil.isNotNullEntity(hf)) {
			delete(hf);
		}
	}

	@Override
	@Transactional
	public void deleteSql(long entityId) {

		getCurrentSession().createSQLQuery(
				"delete from historical_fix where ISSUE_ID = :issueID")
				.setParameter("issueID", entityId);
	}

	@Override
	@Transactional
	public HistoricalFix getEntity(String query) {
		HistoricalFix hf = new HistoricalFix();
		List<HistoricalFix> historicalFixes = getEntities(query);
		if (EntityUtil.isValidList(historicalFixes)) {
			hf = historicalFixes.get(0);
		}

		return hf;
	}

	@Override
	@Transactional
	public HistoricalFix findOne(long entityId) {
		HistoricalFix hf = (HistoricalFix) getCurrentSession().get(
				HistoricalFix.class, entityId);

		return hf;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public HistoricalFix getLastRow() {
		HistoricalFix hf = new HistoricalFix();
		List<HistoricalFix> historicalFixes = getCurrentSession()
				.createSQLQuery(
						"select * from historical_fix hf order by hf.FIX_ID desc limit 1")
				.addEntity(HistoricalFix.class).list();

		if (EntityUtil.isValidList(historicalFixes)) {
			hf = historicalFixes.get(0);
		}

		return hf;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<HistoricalFix> findByPage(long pageNo, long itemPerPage) {
		return getCurrentSession()
				.createSQLQuery(
						"select * from historical_fix hf order by hf.FIX_ID desc limit :offset, perPage")
				.addEntity(HistoricalFix.class).setParameter("offset", pageNo)
				.setParameter("perPage", itemPerPage).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<HistoricalFix> findAll(boolean isDesc) {
		List<HistoricalFix> historicalFixes = new ArrayList<HistoricalFix>();
		if (isDesc) {
			historicalFixes = getCurrentSession()
					.createSQLQuery(
							"select * from historical_fix hf order by hf.FIX_ID desc")
					.addEntity(HistoricalFix.class).list();
		} else {
			historicalFixes = getCurrentSession().createQuery(
					"from HistoricalFix").list();
		}

		return historicalFixes;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<HistoricalFix> getEntities(String query) {
		return getCurrentSession()
				.createSQLQuery(
						"select * from historical_fix hf where " + query
								+ " order by hf.FIX_ID desc")
				.addEntity(HistoricalFix.class).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<HistoricalFix> reportEntities(String fields, String criteria) {
		return getCurrentSession()
				.createSQLQuery(
						"select " + fields + " from historical_fix hf "
								+ criteria).addEntity(HistoricalFix.class)
				.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<HistoricalFix> getHistoricalFixes(long issueId,
			String partNumber) {
		return getCurrentSession()
				.createSQLQuery(
						"select * from historical_fix hf where hf.ISSUE_ID = :issueID and partNum = :partNumber order by hf.FIX_ID desc")
				.addEntity(HistoricalFix.class)
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
