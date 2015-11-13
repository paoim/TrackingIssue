package com.rii.track.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.springframework.stereotype.Service;

import com.rii.track.model.Priority;
import com.rii.track.repository.CRUDRepository;
import com.rii.track.util.ConvertUtil;
import com.rii.track.util.EntityUtil;
import com.rii.track.util.FileUtil;
import com.rii.track.util.PageUtil;

@Service
public class PriorityServiceImpl implements CRUDService<Priority, Priority> {

	private CRUDRepository<Priority> priorityRepository;

	@Override
	public void uploadExcelContent(InputStream is, String fileName) {
		int count = priorityRepository.getTotalItems();
		List<Row> rowList = FileUtil.readExcelRow(is, fileName);
		List<Priority> priorities = ConvertUtil.convertExcelPriority(rowList);

		if (count == 0) {
			for (Priority priority : priorities) {
				priorityRepository.create(priority);
			}
		} else {
			List<Priority> prioritiesForSave = new ArrayList<Priority>();
			List<Priority> prioritiesForUpdate = new ArrayList<Priority>();
			for (Priority priority : priorities) {
				String query = getQuery(priority);
				Priority actualData = priorityRepository.getEntity(query);
				if (actualData != null
						&& actualData.getId() > 0
						&& actualData.getName().equalsIgnoreCase(
								priority.getName())) {
					Priority priorityForUpdate = ConvertUtil.getUpdatePriory(
							actualData.getId(), priority);
					prioritiesForUpdate.add(priorityForUpdate);
				} else {
					prioritiesForSave.add(priority);
				}
			}

			// Update
			for (Priority priority : prioritiesForUpdate) {
				priorityRepository.update(priority);
			}

			// Add new
			for (Priority priority : prioritiesForSave) {
				priorityRepository.create(priority);
			}
		}
	}

	@Override
	public void saveDafult() {
		Priority priority = new Priority();
		priority.setName("(1) High");
		priority.setDescription("This is high products.");
		upsertPriority(priority);

		priority = new Priority();
		priority.setName("(2) Normal");
		priority.setDescription("This is normal products.");
		upsertPriority(priority);

		priority = new Priority();
		priority.setName("(3) Low");
		priority.setDescription("This is low products.");
		upsertPriority(priority);
	}

	/**
	 * Add new record if it does not exist
	 * 
	 * @param priority
	 */
	private void upsertPriority(Priority priority) {
		String query = getQuery(priority);
		Priority actualData = priorityRepository.getEntity(query);

		if (actualData == null
				|| (actualData != null && actualData.getId() == 0)) {
			priorityRepository.create(priority);
		}
	}

	@Override
	public Priority create(Priority entity) {
		priorityRepository.create(entity);

		return entity;
	}

	@Override
	public Priority update(Priority entity) {
		priorityRepository.update(entity);

		return entity;
	}

	@Override
	public void delete(Priority entity) {
		priorityRepository.delete(entity);
	}

	@Override
	public void deleteById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		if (entityId != -1) {
			priorityRepository.deleteById(entityId);
		}
	}

	@Override
	public Priority getLastRecord() {
		Priority priority = priorityRepository.getLastRow();
		if (EntityUtil.isNullEntity(priority)) {
			priority = new Priority();
		}

		return priority;
	}

	@Override
	public Priority getById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		Priority priority = priorityRepository.findOne(entityId);
		if (EntityUtil.isNullEntity(priority)) {
			priority = new Priority();
			priority.setId(entityId);
			priority.setName("(1) High");
			priority.setDescription("This is high products.");
		}

		return priority;
	}

	@Override
	public List<Priority> getAll(String sortDesc) {
		boolean isDesc = Boolean.parseBoolean(sortDesc);
		List<Priority> priorities = priorityRepository.findAll(isDesc);

		return getPriorities(priorities);
	}

	@Override
	public List<Priority> getEntitiesByPageNo(String pageNo, String itemPerPage) {
		long perPage = PageUtil.getItemPerPage(itemPerPage);
		long pageNum = PageUtil.getOffset(pageNo, itemPerPage);
		List<Priority> priorities = priorityRepository.findByPage(pageNum,
				perPage);

		return getPriorities(priorities);
	}

	@Override
	public String getQuery(Priority entity) {
		String query = "";
		if (EntityUtil.isValidString(entity.getName())) {
			query = query + "p.name = '" + entity.getName() + "'";
		}

		return query;
	}

	protected List<Priority> getPriorities(List<Priority> priorities) {
		if (EntityUtil.isEmpltyList(priorities)) {
			priorities = new ArrayList<Priority>();
			/*
			 * Priority priority = new Priority(); priority.setId(1);
			 * priority.setName("(1) High");
			 * priority.setDescription("This is high products.");
			 * priorities.add(priority);
			 * 
			 * priority = new Priority(); priority.setId(2);
			 * priority.setName("(2) Normal");
			 * priority.setDescription("This is normal products.");
			 * priorities.add(priority);
			 * 
			 * priority = new Priority(); priority.setId(3);
			 * priority.setName("(3) Low");
			 * priority.setDescription("This is low products.");
			 * priorities.add(priority);
			 */
		}

		return priorities;
	}

	public void setPriorityRepository(
			CRUDRepository<Priority> priorityRepository) {
		this.priorityRepository = priorityRepository;
	}
}
