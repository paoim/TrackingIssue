package com.rii.track.repository;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.rii.track.model.Todo;
import com.rii.track.util.DateFormatUtil;
import com.rii.track.util.EntityUtil;

@Repository
public class TodoRepositoryImpl implements CRUDRepository<Todo> {

	private SessionFactory sessionFactory;

	@Override
	@Transactional
	public void create(Todo entity) {
		entity.setCreateDate(DateFormatUtil.todayDate());
		getCurrentSession().persist(entity);
	}

	@Override
	@Transactional
	public void update(Todo entity) {
		entity.setUpdateDate(DateFormatUtil.todayDate());
		getCurrentSession().update(entity);
	}

	@Override
	@Transactional
	public void delete(Todo entity) {
		getCurrentSession().delete(entity);
	}

	@Override
	@Transactional
	public void deleteById(long entityId) {
		Todo todo = findOne(entityId);
		if (EntityUtil.isNotNullEntity(todo)) {
			delete(todo);
		}
	}

	@Override
	@Transactional
	public Todo findOne(long entityId) {
		Todo todo = (Todo) getCurrentSession().get(Todo.class, entityId);

		return todo;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Todo> findAll(boolean isDesc) {
		List<Todo> todolist = new ArrayList<Todo>();
		if (isDesc) {
			todolist = getCurrentSession()
					.createSQLQuery("select * from todo order by TODO_ID desc")
					.addEntity(Todo.class).list();
		} else {
			todolist = getCurrentSession().createQuery("from todo").list();
		}

		return todolist;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Todo> findByPage(long pageNo, long itemPerPage) {

		return getCurrentSession()
				.createSQLQuery(
						"select * from todo order by TODO_ID desc limit :offset, :perPage")
				.addEntity(Todo.class).setParameter("offset", pageNo)
				.setParameter("perPage", itemPerPage).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Todo> getEntities(String query) {
		String sql = "select * from todo where " + query
				+ " order by TODO_ID desc";

		return getCurrentSession().createSQLQuery(sql).addEntity(Todo.class)
				.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public Todo getLastRow() {
		Todo todo = new Todo();
		List<Todo> todolist = getCurrentSession()
				.createSQLQuery(
						"select * from todo order by TODO_ID desc limit 1")
				.addEntity(Todo.class).list();

		if (EntityUtil.isValidList(todolist)) {
			todo = todolist.get(0);
		}

		return todo;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<Todo> reportEntities(String fields, String criteria) {

		return getCurrentSession()
				.createSQLQuery("select " + fields + " from todo " + criteria)
				.addEntity(Todo.class).list();
	}

	@Override
	@Transactional
	public int getTotalItems() {

		return findAll(false).size();
	}

	@Override
	@Transactional
	public Todo getEntity(String query) {
		Todo todo = new Todo();
		List<Todo> todolist = getEntities(query);
		if (EntityUtil.isValidList(todolist)) {
			todo = todolist.get(0);
		}

		return todo;
	}

	protected final Session getCurrentSession() {
		return sessionFactory.getCurrentSession();
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}
}
