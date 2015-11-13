package com.rii.track.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.springframework.stereotype.Service;

import com.rii.track.model.Status;
import com.rii.track.repository.CRUDRepository;
import com.rii.track.util.ConvertUtil;
import com.rii.track.util.EntityUtil;
import com.rii.track.util.FileUtil;
import com.rii.track.util.PageUtil;

@Service
public class StatusServiceImpl implements CRUDService<Status, Status> {

	private CRUDRepository<Status> statusRepository;

	@Override
	public void uploadExcelContent(InputStream is, String fileName) {
		int count = statusRepository.getTotalItems();
		List<Row> rowList = FileUtil.readExcelRow(is, fileName);
		List<Status> statusItems = ConvertUtil.convertExcelStatus(rowList);

		if (count == 0) {
			for (Status status : statusItems) {
				statusRepository.create(status);
			}
		} else {
			List<Status> statusItemsForSave = new ArrayList<Status>();
			List<Status> statusItemsForUpdate = new ArrayList<Status>();
			for (Status status : statusItems) {
				String query = getQuery(status);
				Status actualData = statusRepository.getEntity(query);
				if (actualData != null
						&& actualData.getId() > 0
						&& actualData.getName().equalsIgnoreCase(
								status.getName())) {
					Status statusForUpdate = ConvertUtil.getUpdateStatus(
							actualData.getId(), status);
					statusItemsForUpdate.add(statusForUpdate);
				} else {
					statusItemsForSave.add(status);
				}
			}

			// Update
			for (Status status : statusItemsForUpdate) {
				statusRepository.update(status);
			}

			// Add new
			for (Status status : statusItemsForSave) {
				statusRepository.create(status);
			}
		}
	}

	@Override
	public void saveDafult() {
		Status status = new Status();
		status.setName("Active");
		status.setDescription("This is active products.");
		upsertStatus(status);

		status = new Status();
		status.setName("Closed");
		status.setDescription("This is closed products.");
		upsertStatus(status);

		status = new Status();
		status.setName("Resolved");
		status.setDescription("This is resolved products.");
		upsertStatus(status);
	}

	/**
	 * Add new record if it does not exist
	 * 
	 * @param status
	 */
	private void upsertStatus(Status status) {
		String query = getQuery(status);
		Status actualData = statusRepository.getEntity(query);

		if (actualData == null
				|| (actualData != null && actualData.getId() == 0)) {
			statusRepository.create(status);
		}
	}

	@Override
	public Status create(Status entity) {
		statusRepository.create(entity);

		return entity;
	}

	@Override
	public Status update(Status entity) {
		statusRepository.update(entity);

		return entity;
	}

	@Override
	public void delete(Status entity) {
		statusRepository.delete(entity);
	}

	@Override
	public void deleteById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		if (entityId != -1) {
			statusRepository.deleteById(entityId);
		}
	}

	@Override
	public Status getLastRecord() {
		Status status = statusRepository.getLastRow();
		if (EntityUtil.isNullEntity(status)) {
			status = new Status();
		}

		return status;
	}

	@Override
	public Status getById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		Status status = statusRepository.findOne(entityId);
		if (EntityUtil.isNullEntity(status)) {
			status = new Status();
			status.setId(entityId);
			status.setName("Active");
			status.setDescription("This is active products.");
		}

		return status;
	}

	@Override
	public List<Status> getAll(String sortDesc) {
		boolean isDesc = Boolean.parseBoolean(sortDesc);
		List<Status> statusItems = statusRepository.findAll(isDesc);

		return getStatusItems(statusItems);
	}

	@Override
	public List<Status> getEntitiesByPageNo(String pageNo, String itemPerPage) {
		long perPage = PageUtil.getItemPerPage(itemPerPage);
		long pageNum = PageUtil.getOffset(pageNo, itemPerPage);
		List<Status> statusItems = statusRepository
				.findByPage(pageNum, perPage);

		return statusItems;
	}

	@Override
	public String getQuery(Status entity) {
		String query = "";
		if (EntityUtil.isValidString(entity.getName())) {
			query = query + "s.name = '" + entity.getName() + "'";
		}

		return query;
	}

	protected List<Status> getStatusItems(List<Status> statusItems) {
		if (EntityUtil.isEmpltyList(statusItems)) {
			statusItems = new ArrayList<Status>();
			/*
			 * Status status = new Status(); status.setId(1);
			 * status.setName("Active");
			 * status.setDescription("This is active products.");
			 * statusItems.add(status);
			 * 
			 * status = new Status(); status.setId(2); status.setName("Closed");
			 * status.setDescription("This is closed products.");
			 * statusItems.add(status);
			 * 
			 * status = new Status(); status.setId(3);
			 * status.setName("Resolved");
			 * status.setDescription("This is resolved products.");
			 * statusItems.add(status);
			 */
		}

		return statusItems;
	}

	public void setStatusRepository(CRUDRepository<Status> statusRepository) {
		this.statusRepository = statusRepository;
	}
}
