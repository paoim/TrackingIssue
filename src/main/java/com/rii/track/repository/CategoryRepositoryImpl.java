package com.rii.track.repository;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.rii.track.model.Category;
import com.rii.track.util.DateFormatUtil;
import com.rii.track.util.EntityUtil;

@Repository
public class CategoryRepositoryImpl implements CRUDRepository<Category> {

	private SessionFactory sessionFactory;

	// public CategoryRepositoryImpl(SessionFactory sessionFactory) {
	// this.sessionFactory = sessionFactory;
	// }

	@Override
	@Transactional
	public void create(Category entity) {
		entity.setCreateDate(DateFormatUtil.todayDate());
		getCurrentSession().persist(entity);
	}

	@Override
	@Transactional
	public void update(Category entity) {
		entity.setUpdateDate(DateFormatUtil.todayDate());
		getCurrentSession().update(entity);
	}

	@Override
	@Transactional
	public void delete(Category entity) {
		getCurrentSession().delete(entity);
	}

	@Override
	@Transactional
	public void deleteById(long entityId) {
		Category category = findOne(entityId);
		if (EntityUtil.isNotNullEntity(category)) {
			delete(category);
		}
	}

	@Override
	@Transactional
	public Category getEntity(String query) {
		Category category = new Category();
		List<Category> categories = getEntities(query);
		if (EntityUtil.isValidList(categories)) {
			category = categories.get(0);
		}

		return category;
	}

	@Override
	@Transactional
	public Category findOne(long entityId) {
		Category category = (Category) getCurrentSession().get(Category.class,
				entityId);

		return category;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public Category getLastRow() {
		Category category = new Category();
		List<Category> categories = getCurrentSession()
				.createSQLQuery(
						"select * from category cat order by cat.CATEGORY_ID desc limit 1")
				.addEntity(Category.class).list();

		if (EntityUtil.isValidList(categories)) {
			category = categories.get(0);
		}

		return category;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Category> findByPage(long pageNo, long itemPerPage) {

		return getCurrentSession()
				.createSQLQuery(
						"select * from category cat order by cat.CATEGORY_ID desc limit :offset, :perPage")
				.addEntity(Category.class).setParameter("offset", pageNo)
				.setParameter("perPage", itemPerPage).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Category> findAll(boolean isDesc) {
		List<Category> categories = new ArrayList<Category>();
		if (isDesc) {
			categories = getCurrentSession()
					.createSQLQuery(
							"select * from category cat order by cat.CATEGORY_ID desc")
					.addEntity(Category.class).list();
		} else {
			categories = getCurrentSession().createQuery("from Category")
					.list();
		}

		return categories;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Category> getEntities(String query) {

		return getCurrentSession()
				.createSQLQuery("select * from category cat where " + query)
				.addEntity(Category.class).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Category> reportEntities(String fields, String criteria) {

		return getCurrentSession()
				.createSQLQuery(
						"select " + fields + " from category cat " + criteria)
				.addEntity(Category.class).list();
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
