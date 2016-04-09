package com.rii.track.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.springframework.stereotype.Service;

import com.rii.track.model.PartCustomer;
import com.rii.track.repository.CRUDRepository;
import com.rii.track.service.model.IssueFilter;
import com.rii.track.util.ConvertUtil;
import com.rii.track.util.EntityUtil;
import com.rii.track.util.FileUtil;
import com.rii.track.util.FilterUtil;
import com.rii.track.util.PageUtil;

@Service
public class PartCustomerServiceImpl implements
		CRUDService<PartCustomer, PartCustomer>,
		SearchService<PartCustomer, PartCustomer> {

	private CRUDRepository<PartCustomer> partCustomerRepository;

	@Override
	public void uploadExcelContent(InputStream is, String fileName) {
		int count = partCustomerRepository.getTotalItems();
		List<Row> rowList = FileUtil.readExcelRow(is, fileName);
		List<PartCustomer> partCustomers = ConvertUtil
				.convertExcelPartCustomer(rowList);

		if (count == 0) {
			for (PartCustomer partCustomer : partCustomers) {
				partCustomerRepository.create(partCustomer);
			}
		} else {
			// Find new and old records
			List<PartCustomer> partCustomersForSave = new ArrayList<PartCustomer>();
			List<PartCustomer> partCustomersForUpdate = new ArrayList<PartCustomer>();
			for (PartCustomer partCustomer : partCustomers) {
				String query = getQuery(partCustomer);
				PartCustomer actualData = partCustomerRepository
						.getEntity(query);
				if (actualData != null
						&& actualData.getId() > 0
						&& actualData.getCustNum() == partCustomer.getCustNum()
						&& actualData.getPartNum().equalsIgnoreCase(
								partCustomer.getPartNum())) {
					PartCustomer pcUpdate = ConvertUtil.getUpdatePartCustomer(
							actualData.getId(), partCustomer);
					partCustomersForUpdate.add(pcUpdate);
				} else {
					partCustomersForSave.add(partCustomer);
				}
			}

			// Add new Part Customers
			for (PartCustomer partCustomer : partCustomersForSave) {
				partCustomerRepository.create(partCustomer);
			}

			// Update Part Customers
			for (PartCustomer partCustomer : partCustomersForUpdate) {
				partCustomerRepository.update(partCustomer);
			}
		}
	}

	@Override
	public PartCustomer create(PartCustomer entity) {
		partCustomerRepository.create(entity);

		return entity;
	}

	@Override
	public PartCustomer update(PartCustomer entity) {
		partCustomerRepository.update(entity);

		return entity;
	}

	@Override
	public void delete(PartCustomer entity) {
		partCustomerRepository.delete(entity);
	}

	@Override
	public void deleteById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		if (entityId != -1) {
			partCustomerRepository.deleteById(entityId);
		}
	}

	@Override
	public PartCustomer getLastRecord() {
		PartCustomer pc = partCustomerRepository.getLastRow();
		if (EntityUtil.isNullEntity(pc)) {
			pc = new PartCustomer();
		}

		return pc;
	}

	@Override
	public PartCustomer getById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		PartCustomer pc = partCustomerRepository.findOne(entityId);
		if (EntityUtil.isNullEntity(pc)) {
			pc = new PartCustomer();
		}

		return pc;
	}

	@Override
	public List<PartCustomer> getAll(String sortDesc) {
		boolean isDesc = Boolean.parseBoolean(sortDesc);
		List<PartCustomer> partCustomers = partCustomerRepository
				.findAll(isDesc);
		if (EntityUtil.isEmpltyList(partCustomers)) {
			partCustomers = new ArrayList<PartCustomer>();
		}

		return partCustomers;
	}

	@Override
	public List<PartCustomer> getEntitiesByPageNo(String pageNo,
			String itemPerPage) {
		long perPage = PageUtil.getItemPerPage(itemPerPage);
		long pageNum = PageUtil.getOffset(pageNo, itemPerPage);
		List<PartCustomer> partCustomers = partCustomerRepository.findByPage(
				pageNum, perPage);
		if (EntityUtil.isEmpltyList(partCustomers)) {
			partCustomers = new ArrayList<PartCustomer>();
		}

		return partCustomers;
	}

	@Override
	public String getQuery(PartCustomer partCustomer) {
		String query = "";
		if (partCustomer.getCustNum() != -1) {
			query = query + "p.custNum = " + partCustomer.getCustNum()
					+ " and ";
		}
		if (EntityUtil.isValidString(partCustomer.getCustId())) {
			query = query + "p.CustID = '" + partCustomer.getCustId()
					+ "' and ";
		}
		// if (EntityUtil.isValidString(partCustomer.getCustName())) {
		// query = query + "p.CustName = '" + partCustomer.getCustName()
		// + "' and ";
		// }
		if (EntityUtil.isValidString(partCustomer.getPartNum())) {
			query = query + "p.PartNum = '" + partCustomer.getPartNum() + "'";
		}

		if (EntityUtil.isValidString(query) && query.endsWith(" and ")) {
			query = query.substring(0, query.length() - " and ".length());
		}

		return query;
	}

	@Override
	public void saveDafult() {

	}

	@Override
	public List<PartCustomer> postSearch(IssueFilter filter) {
		String query = FilterUtil.getIssueSearchQuery(filter);
		List<PartCustomer> partCustomers = partCustomerRepository
				.getEntities(query);

		return partCustomers;
	}

	@Override
	public List<PartCustomer> getSearch(String query) {
		List<PartCustomer> partCustomers = partCustomerRepository
				.getEntities(query);

		return partCustomers;
	}

	public void setPartCustomerRepository(
			CRUDRepository<PartCustomer> partCustomerRepository) {
		this.partCustomerRepository = partCustomerRepository;
	}
}
