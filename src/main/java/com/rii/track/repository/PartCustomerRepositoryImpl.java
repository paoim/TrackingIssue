package com.rii.track.repository;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.transaction.annotation.Transactional;

import com.rii.track.model.PartCustomer;
import com.rii.track.util.DateFormatUtil;
import com.rii.track.util.EntityUtil;

public class PartCustomerRepositoryImpl implements CRUDRepository<PartCustomer> {

	private SessionFactory sessionFactory;

	@Override
	@Transactional
	public void create(PartCustomer entity) {
		entity.setCreateDate(DateFormatUtil.todayDate());
		getCurrentSession().persist(entity);
	}

	@Override
	@Transactional
	public void update(PartCustomer entity) {
		entity.setUpdateDate(DateFormatUtil.todayDate());
		getCurrentSession().update(entity);
	}

	@Override
	@Transactional
	public void delete(PartCustomer entity) {
		getCurrentSession().delete(entity);
	}

	@Override
	@Transactional
	public void deleteById(long entityId) {
		PartCustomer partCustomer = findOne(entityId);
		if (partCustomer != null) {
			delete(partCustomer);
		}
	}

	@Override
	@Transactional
	public PartCustomer getEntity(String query) {
		PartCustomer partCustomer = new PartCustomer();
		List<PartCustomer> partCustomers = getEntities(query);

		if (EntityUtil.isValidList(partCustomers)) {
			partCustomer = partCustomers.get(0);
		}

		return partCustomer;
	}

	@Override
	@Transactional
	public PartCustomer findOne(long entityId) {
		PartCustomer partCustomer = (PartCustomer) getCurrentSession().get(
				PartCustomer.class, entityId);

		return partCustomer;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public PartCustomer getLastRow() {
		PartCustomer partCustomer = new PartCustomer();
		List<PartCustomer> partCustomers = getCurrentSession()
				.createSQLQuery(
						"select * from part_customer p order by p.PARTCUSTOMER_ID desc limit 1")
				.addEntity(PartCustomer.class).list();

		if (EntityUtil.isValidList(partCustomers)) {
			partCustomer = partCustomers.get(0);
		}

		return partCustomer;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<PartCustomer> findByPage(long pageNo, long itemPerPage) {

		return getCurrentSession()
				.createSQLQuery(
						"select * from part_customer p order by p.PARTCUSTOMER_ID desc limit :offset, :perPage")
				.addEntity(PartCustomer.class).setParameter("offset", pageNo)
				.setParameter("perPage", itemPerPage).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<PartCustomer> findAll(boolean isDesc) {
		List<PartCustomer> partCustomers = new ArrayList<PartCustomer>();
		if (isDesc) {
			partCustomers = getCurrentSession()
					.createSQLQuery(
							"select * from part_customer p order by p.PARTCUSTOMER_ID desc")
					.addEntity(PartCustomer.class).list();
		} else {
			partCustomers = getCurrentSession()
					.createQuery("from PartCustomer").list();
		}

		return partCustomers;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<PartCustomer> getEntities(String query) {

		return getCurrentSession()
				.createSQLQuery("select * from part_customer p where " + query)
				.addEntity(PartCustomer.class).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<PartCustomer> reportEntities(String fields, String criteria) {

		return getCurrentSession()
				.createSQLQuery(
						"select " + fields + " from part_customer p "
								+ criteria).addEntity(PartCustomer.class)
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
