package com.rii.track.repository;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.rii.track.model.Contact;
import com.rii.track.util.DateFormatUtil;
import com.rii.track.util.EntityUtil;

@Repository
public class ContactRepositoryImpl implements CRUDRepository<Contact> {

	private SessionFactory sessionFactory;

	@Override
	@Transactional
	public void create(Contact entity) {
		entity.setCreateDate(DateFormatUtil.todayDate());
		getCurrentSession().persist(entity);
	}

	@Override
	@Transactional
	public void update(Contact entity) {
		entity.setUpdateDate(DateFormatUtil.todayDate());
		getCurrentSession().update(entity);
	}

	@Override
	@Transactional
	public void delete(Contact entity) {
		getCurrentSession().delete(entity);
	}

	@Override
	@Transactional
	public void deleteById(long entityId) {
		Contact contact = findOne(entityId);
		if (contact != null) {
			delete(contact);
		}
	}

	@Override
	@Transactional
	public Contact getEntity(String query) {
		Contact contact = new Contact();
		List<Contact> contacts = getEntities(query);

		if (EntityUtil.isValidList(contacts)) {
			contact = contacts.get(0);
		}

		return contact;
	}

	@Override
	@Transactional
	public Contact findOne(long entityId) {
		Contact contact = (Contact) getCurrentSession().get(Contact.class,
				entityId);

		return contact;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public Contact getLastRow() {
		Contact contact = new Contact();
		List<Contact> contacts = getCurrentSession()
				.createSQLQuery(
						"select * from contact c order by c.CONTACT_ID desc limit 1")
				.addEntity(Contact.class).list();

		if (EntityUtil.isValidList(contacts)) {
			contact = contacts.get(0);
		}

		return contact;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Contact> findByPage(long pageNo, long itemPerPage) {

		return getCurrentSession()
				.createSQLQuery(
						"select * from contact c order by c.CONTACT_ID desc limit :offset, :perPage")
				.addEntity(Contact.class).setParameter("offset", pageNo)
				.setParameter("perPage", itemPerPage).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Contact> findAll(boolean isDesc) {
		List<Contact> contacts = new ArrayList<Contact>();
		if (isDesc) {
			contacts = getCurrentSession()
					.createSQLQuery(
							"select * from contact c order by c.CONTACT_ID desc")
					.addEntity(Contact.class).list();
		} else {
			contacts = getCurrentSession().createQuery("from Contact").list();
		}

		return contacts;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Contact> getEntities(String query) {

		return getCurrentSession()
				.createSQLQuery("select * from contact c where " + query)
				.addEntity(Contact.class).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Contact> reportEntities(String fields, String criteria) {

		return getCurrentSession()
				.createSQLQuery(
						"select " + fields + " from contact c" + criteria)
				.addEntity(Contact.class).list();
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
