package com.rii.track.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;

import com.rii.track.model.HistoricalFix;
import com.rii.track.repository.HistoricalFixRepository;
import com.rii.track.service.model.HistoricalFixResult;
import com.rii.track.service.model.IssueFilter;
import com.rii.track.util.ConvertUtil;
import com.rii.track.util.EntityUtil;
import com.rii.track.util.FileUtil;
import com.rii.track.util.FilterUtil;
import com.rii.track.util.PageUtil;

public class HistoricalFixServiceImpl implements HistoricalFixService {

	private HistoricalFixRepository historicalFixRepository;

	@Override
	public void uploadExcelContent(InputStream is, String fileName) {
		int count = historicalFixRepository.getTotalItems();
		List<Row> rowList = FileUtil.readExcelRow(is, fileName);
		List<HistoricalFix> historicalFixes = ConvertUtil
				.convertExcelHistoricalFix(rowList);

		if (count == 0) {
			for (HistoricalFix historicalFix : historicalFixes) {
				historicalFixRepository.create(historicalFix);
			}
		} else {
			// Find new and old records
			List<HistoricalFix> historicalFixesForSave = new ArrayList<HistoricalFix>();
			List<HistoricalFix> historicalFixesForUpdate = new ArrayList<HistoricalFix>();
			for (HistoricalFix historicalFix : historicalFixes) {
				String query = getQuery(historicalFix);
				HistoricalFix actualData = historicalFixRepository
						.getEntity(query);

				if (actualData != null
						&& actualData.getId() > 0
						&& actualData.getIssueID() == historicalFix
								.getIssueID()
						&& actualData.getVersionFix() != null
						&& actualData.getVersionFix().equalsIgnoreCase(
								historicalFix.getVersionFix())) {
					HistoricalFix chUpdate = ConvertUtil
							.getUpdateHistoricalFix(actualData.getId(),
									historicalFix);
					historicalFixesForUpdate.add(chUpdate);
				} else {
					historicalFixesForSave.add(historicalFix);
				}
			}

			// Save new
			for (HistoricalFix hf : historicalFixesForSave) {
				historicalFixRepository.create(hf);
			}

			// Update
			for (HistoricalFix hf : historicalFixesForUpdate) {
				historicalFixRepository.update(hf);
			}
		}
	}

	@Override
	public HistoricalFixResult create(HistoricalFix entity) {
		addVersionFix(entity);
		historicalFixRepository.create(entity);
		HistoricalFix hf = historicalFixRepository.getLastRow();

		return getResult(hf);
	}

	@Override
	public HistoricalFixResult update(HistoricalFix entity) {
		// addVersionFix(entity);
		historicalFixRepository.update(entity);
		HistoricalFix hf = historicalFixRepository.findOne(entity.getId());

		return getResult(hf);
	}

	@Override
	public void delete(HistoricalFix entity) {
		historicalFixRepository.delete(entity);
	}

	@Override
	public void deleteById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		if (entityId != -1) {
			historicalFixRepository.deleteById(entityId);
		}
	}

	@Override
	public HistoricalFixResult getLastRecord() {
		HistoricalFix historicalFix = historicalFixRepository.getLastRow();
		if (EntityUtil.isNullEntity(historicalFix)) {
			historicalFix = new HistoricalFix();
		}

		return getResult(historicalFix);
	}

	@Override
	public HistoricalFixResult getById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		HistoricalFix historicalFix = historicalFixRepository.findOne(entityId);
		if (EntityUtil.isNullEntity(historicalFix)) {
			historicalFix = new HistoricalFix();
		}

		return getResult(historicalFix);
	}

	@Override
	public List<HistoricalFixResult> getAll(String sortDesc) {
		boolean isDesc = Boolean.parseBoolean(sortDesc);
		List<HistoricalFix> historicalFixes = historicalFixRepository
				.findAll(isDesc);
		if (EntityUtil.isEmpltyList(historicalFixes)) {
			historicalFixes = new ArrayList<HistoricalFix>();
		}

		return getResults(historicalFixes);
	}

	@Override
	public List<HistoricalFixResult> getEntitiesByPageNo(String pageNo,
			String itemPerPage) {
		long perPage = PageUtil.getItemPerPage(itemPerPage);
		long pageNum = PageUtil.getOffset(pageNo, itemPerPage);
		List<HistoricalFix> historicalFixes = historicalFixRepository
				.findByPage(pageNum, perPage);

		if (EntityUtil.isEmpltyList(historicalFixes)) {
			historicalFixes = new ArrayList<HistoricalFix>();
		}

		return getResults(historicalFixes);
	}

	@Override
	public List<HistoricalFixResult> reportEntities(IssueFilter filter) {
		String criteria = FilterUtil.getIssueReortQuery(filter);
		List<HistoricalFix> historicalFixes = historicalFixRepository
				.getEntities(criteria);

		if (EntityUtil.isEmpltyList(historicalFixes)) {
			historicalFixes = new ArrayList<HistoricalFix>();
		}

		return getResults(historicalFixes);
	}

	@Override
	public List<HistoricalFixResult> getIssueList(String issueID) {
		String query = "ISSUE_ID like '%" + issueID + "%'";
		List<HistoricalFix> historicalFixes = historicalFixRepository
				.getEntities(query);

		if (EntityUtil.isEmpltyList(historicalFixes)) {
			historicalFixes = new ArrayList<HistoricalFix>();
		}

		List<HistoricalFixResult> results = new ArrayList<HistoricalFixResult>();
		for (HistoricalFix hf : historicalFixes) {
			HistoricalFixResult result = new HistoricalFixResult();
			result.setId(hf.getId());
			result.setIssueID(hf.getIssueID());
			results.add(result);
		}

		return results;
	}

	@Override
	public List<HistoricalFixResult> getPartNumList(String partNum) {
		String query = "PartNum like '%" + partNum + "%'";
		List<HistoricalFix> historicalFixes = historicalFixRepository
				.getEntities(query);

		if (EntityUtil.isEmpltyList(historicalFixes)) {
			historicalFixes = new ArrayList<HistoricalFix>();
		}

		List<HistoricalFixResult> results = new ArrayList<HistoricalFixResult>();
		for (HistoricalFix hf : historicalFixes) {
			HistoricalFixResult result = new HistoricalFixResult();
			result.setId(hf.getId());
			result.setPartNum(hf.getPartNumber());
			results.add(result);
		}

		return results;
	}

	@Override
	public String getQuery(HistoricalFix entity) {
		String query = "";
		if (entity.getIssueID() != -1) {
			query = query + "hf.ISSUE_ID = " + entity.getIssueID() + " and ";
		}
		if (EntityUtil.isValidString(entity.getVersionFix())) {
			query = query + "hf.versionFix = '" + entity.getVersionFix() + "'";
		}

		if (EntityUtil.isValidString(query) && query.endsWith(" and ")) {
			query = query.substring(0, query.length() - " and ".length());
		}

		return query;
	}

	private List<HistoricalFixResult> getResults(List<HistoricalFix> hfList) {
		List<HistoricalFixResult> results = new ArrayList<HistoricalFixResult>();
		for (HistoricalFix hf : hfList) {
			HistoricalFixResult result = getResult(hf);
			results.add(result);
		}

		return results;
	}

	private HistoricalFixResult getResult(HistoricalFix hf) {
		HistoricalFixResult result = ConvertUtil.historicalFixConverter(hf);

		return result;
	}

	private void addVersionFix(HistoricalFix entity) {
		if (EntityUtil.isValidString(entity.getVersionFix())) {
			String versionProblem = ConvertUtil.getVersion() + " "
					+ entity.getVersionFix();
			entity.setVersionFix(versionProblem);
		}
	}

	@Override
	public void saveDafult() {

	}

	public void setHistoricalFixRepository(
			HistoricalFixRepository historicalFixRepository) {
		this.historicalFixRepository = historicalFixRepository;
	}
}
