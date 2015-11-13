package com.rii.track.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;

import com.rii.track.model.HistoricalProblem;
import com.rii.track.model.Issue;
import com.rii.track.repository.HistoricalProblemRepository;
import com.rii.track.repository.IssueRepository;
import com.rii.track.service.model.HistoricalProblemResult;
import com.rii.track.service.model.IssueFilter;
import com.rii.track.util.ConvertUtil;
import com.rii.track.util.EntityUtil;
import com.rii.track.util.FileUtil;
import com.rii.track.util.FilterUtil;
import com.rii.track.util.PageUtil;

public class HistoricalProblemServiceImpl implements HistoricalProblemService { // CommentHistoryServiceImpl

	private HistoricalProblemRepository historicalProblemRepository;
	private IssueRepository issueRepository;

	@Override
	public void uploadExcelContent(InputStream is, String fileName) {
		int count = historicalProblemRepository.getTotalItems();
		List<Row> rowList = FileUtil.readExcelRow(is, fileName);
		List<HistoricalProblem> historicalProblems = ConvertUtil
				.convertExcelHistoricalProblem(rowList);

		if (count == 0) {
			for (HistoricalProblem historicalProblem : historicalProblems) {
				historicalProblemRepository.create(historicalProblem);
			}
		} else {
			// Find new and old records
			List<HistoricalProblem> historicalProblemsForSave = new ArrayList<HistoricalProblem>();
			List<HistoricalProblem> historicalProblemsForUpdate = new ArrayList<HistoricalProblem>();
			for (HistoricalProblem historicalProblem : historicalProblems) {
				String query = getQuery(historicalProblem);
				HistoricalProblem actualData = historicalProblemRepository
						.getEntity(query);

				if (actualData != null
						&& actualData.getId() > 0
						&& actualData.getIssueID() == historicalProblem
								.getIssueID()
						&& actualData.getVersionProblem() != null
						&& actualData.getVersionProblem().equalsIgnoreCase(
								historicalProblem.getVersionProblem())) {
					HistoricalProblem chUpdate = ConvertUtil
							.getUpdateHistoricalProblem(actualData.getId(),
									historicalProblem);
					historicalProblemsForUpdate.add(chUpdate);
				} else {
					historicalProblemsForSave.add(historicalProblem);
				}
			}

			// Save new
			for (HistoricalProblem hp : historicalProblemsForSave) {
				historicalProblemRepository.create(hp);
			}

			// Update
			for (HistoricalProblem hp : historicalProblemsForUpdate) {
				historicalProblemRepository.update(hp);
			}
		}
	}

	@Override
	public HistoricalProblemResult create(HistoricalProblem entity) {
		addVersionProblem(entity);
		historicalProblemRepository.create(entity);
		HistoricalProblem hp = historicalProblemRepository.getLastRow();

		return getResult(hp);
	}

	@Override
	public HistoricalProblemResult update(HistoricalProblem entity) {
		// addVersionProblem(entity);
		historicalProblemRepository.update(entity);
		HistoricalProblem hp = historicalProblemRepository.findOne(entity
				.getId());

		return getResult(hp);
	}

	@Override
	public void updatePartNum() {
		List<HistoricalProblem> historicalProblems = historicalProblemRepository
				.findAll(false);
		for (HistoricalProblem hp : historicalProblems) {
			if (hp.getIssueID() > 0
					&& (hp.getPartNumber() == null || (hp.getPartNumber() != null && hp
							.getPartNumber().length() == 0))) {
				Issue issue = issueRepository.findOne(hp.getIssueID());
				if (issue != null && issue.getId() > 0) {
					if (issue.getPartNumber() != null
							&& issue.getPartNumber().length() > 0) {
						hp.setPartNumber(issue.getPartNumber());
						historicalProblemRepository.update(hp);
					}
				}
			}
		}
	}

	@Override
	public void delete(HistoricalProblem entity) {
		historicalProblemRepository.delete(entity);
	}

	@Override
	public void deleteById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		if (entityId != -1) {
			historicalProblemRepository.deleteById(entityId);
		}
	}

	@Override
	public HistoricalProblemResult getLastRecord() {
		HistoricalProblem historicalProblem = historicalProblemRepository
				.getLastRow();
		if (EntityUtil.isNullEntity(historicalProblem)) {
			historicalProblem = new HistoricalProblem();
		}

		return getResult(historicalProblem);
	}

	@Override
	public HistoricalProblemResult getById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		HistoricalProblem historicalProblem = historicalProblemRepository
				.findOne(entityId);
		if (EntityUtil.isNullEntity(historicalProblem)) {
			historicalProblem = new HistoricalProblem();
		}

		return getResult(historicalProblem);
	}

	@Override
	public List<HistoricalProblemResult> getAll(String sortDesc) {
		boolean isDesc = Boolean.parseBoolean(sortDesc);
		List<HistoricalProblem> historicalProblems = historicalProblemRepository
				.findAll(isDesc);
		if (EntityUtil.isEmpltyList(historicalProblems)) {
			historicalProblems = new ArrayList<HistoricalProblem>();
		}

		return getResults(historicalProblems);
	}

	@Override
	public List<HistoricalProblemResult> getEntitiesByPageNo(String pageNo,
			String itemPerPage) {
		long perPage = PageUtil.getItemPerPage(itemPerPage);
		long pageNum = PageUtil.getOffset(pageNo, itemPerPage);
		List<HistoricalProblem> historicalProblems = historicalProblemRepository
				.findByPage(pageNum, perPage);

		if (EntityUtil.isEmpltyList(historicalProblems)) {
			historicalProblems = new ArrayList<HistoricalProblem>();
		}

		return getResults(historicalProblems);
	}

	@Override
	public List<HistoricalProblemResult> reportEntities(IssueFilter filter) {
		String criteria = FilterUtil.getIssueReortQuery(filter);
		List<HistoricalProblem> historicalProblems = historicalProblemRepository
				.getEntities(criteria);

		if (EntityUtil.isEmpltyList(historicalProblems)) {
			historicalProblems = new ArrayList<HistoricalProblem>();
		}

		return getResults(historicalProblems);
	}

	@Override
	public List<HistoricalProblemResult> getIssueList(String issueID) {
		String query = "ISSUE_ID like '%" + issueID + "%'";
		List<HistoricalProblem> historicalProblems = historicalProblemRepository
				.getEntities(query);

		if (EntityUtil.isEmpltyList(historicalProblems)) {
			historicalProblems = new ArrayList<HistoricalProblem>();
		}

		List<HistoricalProblemResult> results = new ArrayList<HistoricalProblemResult>();
		for (HistoricalProblem hp : historicalProblems) {
			HistoricalProblemResult result = new HistoricalProblemResult();
			result.setId(hp.getId());
			result.setIssueID(hp.getIssueID());
			results.add(result);
		}

		return results;
	}

	@Override
	public List<HistoricalProblemResult> getPartNumList(String partNum) {
		String query = "PartNum like '%" + partNum + "%'";
		List<HistoricalProblem> historicalProblems = historicalProblemRepository
				.getEntities(query);

		if (EntityUtil.isEmpltyList(historicalProblems)) {
			historicalProblems = new ArrayList<HistoricalProblem>();
		}

		List<HistoricalProblemResult> results = new ArrayList<HistoricalProblemResult>();
		for (HistoricalProblem hp : historicalProblems) {
			HistoricalProblemResult result = new HistoricalProblemResult();
			result.setId(hp.getId());
			result.setPartNum(hp.getPartNumber());
			results.add(result);
		}

		return results;
	}

	@Override
	public String getQuery(HistoricalProblem entity) {
		String query = "";
		if (entity.getIssueID() != -1) {
			query = query + "hp.ISSUE_ID = " + entity.getIssueID() + " and ";
		}
		if (EntityUtil.isValidString(entity.getVersionProblem())) {
			query = query + "hp.versionProblem = '"
					+ entity.getVersionProblem() + "'";
		}

		if (EntityUtil.isValidString(query) && query.endsWith(" and ")) {
			query = query.substring(0, query.length() - " and ".length());
		}

		return query;
	}

	private List<HistoricalProblemResult> getResults(
			List<HistoricalProblem> hpList) {
		List<HistoricalProblemResult> results = new ArrayList<HistoricalProblemResult>();
		for (HistoricalProblem hp : hpList) {
			HistoricalProblemResult result = getResult(hp);
			results.add(result);
		}

		return results;
	}

	private HistoricalProblemResult getResult(HistoricalProblem hp) {
		HistoricalProblemResult result = ConvertUtil
				.historicalProblemConverter(hp);

		return result;
	}

	private void addVersionProblem(HistoricalProblem entity) {
		if (EntityUtil.isValidString(entity.getVersionProblem())) {
			String versionProblem = ConvertUtil.getVersion() + " "
					+ entity.getVersionProblem();
			entity.setVersionProblem(versionProblem);
		}
	}

	@Override
	public void saveDafult() {

	}

	public void setHistoricalProblemRepository(
			HistoricalProblemRepository historicalProblemRepository) {
		this.historicalProblemRepository = historicalProblemRepository;
	}

	public void setIssueRepository(IssueRepository issueRepository) {
		this.issueRepository = issueRepository;
	}
}
