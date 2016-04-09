package com.rii.track.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.springframework.stereotype.Service;

import com.rii.track.model.Category;
import com.rii.track.model.Contact;
import com.rii.track.model.HistoricalFix;
import com.rii.track.model.HistoricalProblem;
import com.rii.track.model.Issue;
import com.rii.track.model.Photo;
import com.rii.track.model.Priority;
import com.rii.track.model.Status;
import com.rii.track.repository.CRUDRepository;
import com.rii.track.repository.HistoricalFixRepository;
import com.rii.track.repository.HistoricalProblemRepository;
import com.rii.track.repository.IssueRepository;
import com.rii.track.service.model.IssueFilter;
import com.rii.track.service.model.IssueResult;
import com.rii.track.util.ConvertUtil;
import com.rii.track.util.EntityUtil;
import com.rii.track.util.FileUtil;
import com.rii.track.util.FilterUtil;
import com.rii.track.util.PageUtil;

@Service
public class IssueServiceImpl implements CRUDService<Issue, IssueResult>,
		IssueRelatedService<Issue, IssueResult> {

	private IssueRepository issueRepository;
	private CRUDRepository<Photo> photoRepository;
	private CRUDRepository<Status> statusRepository;
	private CRUDRepository<Contact> contactRepository;
	private CRUDRepository<Category> categoryRepository;
	private CRUDRepository<Priority> priorityRepository;
	private HistoricalFixRepository historicalFixRepository;
	private HistoricalProblemRepository historicalProblemRepository;

	@Override
	public void uploadExcelContent(InputStream is, String fileName) {
		int count = issueRepository.getTotalItems();
		List<Row> rowList = FileUtil.readExcelRow(is, fileName);
		List<Issue> issues = ConvertUtil.convertExcelIssue(rowList);

		if (count == 0) {
			for (Issue issue : issues) {
				issueRepository.create(issue);
			}
		} else {
			List<Issue> issuesForSave = new ArrayList<Issue>();
			List<Issue> issuesForUpdate = new ArrayList<Issue>();
			for (Issue issue : issues) {
				String query = getQuery(issue);
				Issue actualData = issueRepository.getEntity(query);
				if (actualData != null
						&& actualData.getId() > 0
						&& actualData.getPartNumber().equalsIgnoreCase(
								issue.getPartNumber())
						&& actualData.getCustomterName().equalsIgnoreCase(
								issue.getCustomterName())
						&& actualData.getCategory() == issue.getCategory()
						&& actualData.getPriority() == issue.getPriority()
						&& actualData.getStatus() == issue.getStatus()) {
					Issue issueForUpdate = ConvertUtil.getUpdateIssue(
							actualData.getId(), issue);
					issuesForUpdate.add(issueForUpdate);
				} else {
					issuesForSave.add(issue);
				}
			}

			// Update
			for (Issue priority : issuesForUpdate) {
				issueRepository.update(priority);
			}

			// Add new
			for (Issue priority : issuesForSave) {
				issueRepository.create(priority);
			}
		}
	}

	@Override
	public void saveDafult() {

	}

	@Override
	public void updateHistoricalFix() {
		List<Issue> issueList = issueRepository.findAll(false);
		for (Issue issue : issueList) {
			if (issue.getIssueIdFromExcel() > 0) {
				List<HistoricalFix> hfList = getHistoricalFixes(
						issue.getIssueIdFromExcel(), issue.getPartNumber());
				for (HistoricalFix hf : hfList) {
					String sql = "UPDATE historical_fix SET ISSUE_ID = "
							+ issue.getId() + ", partNum = "
							+ issue.getPartNumber() + " WHERE FIX_ID = "
							+ hf.getId();
					historicalFixRepository.updateSql(sql);
				}
			}
		}
	}

	@Override
	public void updateHistoricalProblem() {
		List<Issue> issueList = issueRepository.findAll(false);
		for (Issue issue : issueList) {
			if (issue.getIssueIdFromExcel() > 0) {
				List<HistoricalProblem> hpList = getHistoricalProblems(
						issue.getIssueIdFromExcel(), issue.getPartNumber());
				for (HistoricalProblem hp : hpList) {
					String sql = "UPDATE historical_problem SET ISSUE_ID = "
							+ issue.getId() + ", partNum = "
							+ issue.getPartNumber() + " WHERE PROBLEM_ID = "
							+ hp.getId();
					historicalProblemRepository.updateSql(sql);
				}
			}
		}
	}

	@Override
	public IssueResult create(Issue entity) {
		issueRepository.create(entity);
		Issue issue = issueRepository.getLastRow();

		// Add new historical Problem and Fix
		if (issue.getId() > 0 || issue.getIssueIdFromExcel() > 0) {
			addNewHistoricalProblem(issue.getId(), entity.getProblem(),
					entity.getPartNumber());
			addNewHistoricalFix(issue.getId(), entity.getFix(),
					entity.getPartNumber());
		}

		return getResult(issue, false);
	}

	@Override
	public IssueResult update(Issue entity) {
		List<String> relatedIssueIds = new ArrayList<String>();
		List<Issue> relatedIssues = new ArrayList<Issue>();
		Issue newIssue = entity;

		// Related Issues
		if (entity.getRelatedIssues().size() > 0) {
			for (Issue issue : entity.getRelatedIssues()) {
				Issue relatedIssue = issueRepository.findOne(issue.getId());
				if (relatedIssue != null) {
					relatedIssues.add(relatedIssue);
					relatedIssueIds.add("" + relatedIssue.getId());
				}
			}

			newIssue = ConvertUtil.issueConverter(entity, relatedIssues,
					relatedIssueIds.toString());
		}

		// Add new historical problem if not exist
		Issue issueDb = issueRepository.findOne(newIssue.getId());
		boolean isValidProblem = EntityUtil.isValidHistory(
				issueDb.getProblem(), newIssue.getProblem(), newIssue.getId(),
				newIssue.getIssueIdFromExcel(), issueDb.getId(),
				issueDb.getIssueIdFromExcel());
		// System.out.println("isValidProblem: " + isValidProblem);
		if (isValidProblem) {
			addNewHistoricalProblem(newIssue.getId(), newIssue.getProblem(),
					newIssue.getPartNumber());
		}

		// Add new historical fix if not exist
		boolean isValidFix = EntityUtil.isValidHistory(issueDb.getFix(),
				newIssue.getFix(), newIssue.getId(),
				newIssue.getIssueIdFromExcel(), issueDb.getId(),
				issueDb.getIssueIdFromExcel());
		// System.out.println("isValidFix: " + isValidFix);
		if (isValidFix) {
			addNewHistoricalFix(newIssue.getId(), newIssue.getFix(),
					newIssue.getPartNumber());
		}

		issueRepository.update(newIssue);
		Issue issue = issueRepository.findOne(newIssue.getId());

		return getResult(issue, false);
	}

	@Override
	public void delete(Issue entity) {
		deleteHistoricalFix(entity.getId(), entity.getPartNumber());
		deleteHistoricalProblem(entity.getId(), entity.getPartNumber());

		deletePhoto(entity);

		issueRepository.delete(entity);
	}

	@Override
	public void deleteById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		if (entityId != -1) {
			Issue issue = issueRepository.findOne(entityId);
			if (issue != null) {
				deleteHistoricalFix(entityId, issue.getPartNumber());
				deleteHistoricalProblem(entityId, issue.getPartNumber());
				deletePhoto(issue);
			}

			issueRepository.deleteById(entityId);
		}
	}

	@Override
	public IssueResult getLastRecord() {
		Issue issue = issueRepository.getLastRow();
		if (EntityUtil.isNullEntity(issue)) {
			issue = new Issue();
		}

		IssueResult result = getResult(issue, true);
		if (result.getRelatedIssueIds() != null) {
			List<IssueResult> results = getRelatedIssues(result
					.getRelatedIssueIds());
			result.setRelatedIssues(results);
		}

		return result;
	}

	@Override
	public IssueResult getById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		Issue issue = issueRepository.findOne(entityId);
		if (EntityUtil.isNullEntity(issue)) {
			issue = new Issue();
		}

		IssueResult result = getResult(issue, true);
		if (result.getRelatedIssueIds() != null) {
			List<IssueResult> results = getRelatedIssues(result
					.getRelatedIssueIds());
			result.setRelatedIssues(results);
		}

		return result;
	}

	@Override
	public IssueResult getBriefIssueById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		Issue issue = issueRepository.findOne(entityId);
		if (EntityUtil.isNullEntity(issue)) {
			issue = new Issue();
		}

		IssueResult result = getResult(issue, false);

		return result;
	}

	@Override
	public IssueResult getPartNumById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		Issue issue = issueRepository.findOne(entityId);
		if (EntityUtil.isNullEntity(issue)) {
			issue = new Issue();
		}

		IssueResult result = getPartNumIssue(issue);

		return result;
	}

	@Override
	public List<IssueResult> getAll(String sortDesc) {
		boolean isDesc = Boolean.parseBoolean(sortDesc);
		List<Issue> issues = issueRepository.findAll(isDesc);
		if (EntityUtil.isEmpltyList(issues)) {
			issues = new ArrayList<Issue>();
		}

		return getIssues(issues, false);
	}

	@Override
	public List<IssueResult> getEntitiesByPageNo(String pageNo,
			String itemPerPage) {
		long perPage = PageUtil.getItemPerPage(itemPerPage);
		long pageNum = PageUtil.getOffset(pageNo, itemPerPage);
		List<Issue> issues = issueRepository.findByPage(pageNum, perPage);
		if (EntityUtil.isEmpltyList(issues)) {
			issues = new ArrayList<Issue>();
		}

		return getIssues(issues, false);
	}

	@Override
	public List<IssueResult> getPartNumList(String partNum) {
		String query = "iss.PartNum like '" + partNum + "%'";
		List<Issue> issues = issueRepository.getEntities(query);
		if (EntityUtil.isEmpltyList(issues)) {
			issues = new ArrayList<Issue>();
		}

		return getPartNumIssues(issues);
	}

	@Override
	public List<IssueResult> postSearch(IssueFilter filter) {
		String query = FilterUtil.getIssueSearchQuery(filter);
		List<Issue> issues = issueRepository.getEntities(query);
		if (EntityUtil.isEmpltyList(issues)) {
			issues = new ArrayList<Issue>();
		}

		return getResults(issues, false);
	}

	@Override
	public List<IssueResult> getSearch(String query) {
		List<Issue> issues = issueRepository.getEntities(query);
		if (EntityUtil.isEmpltyList(issues)) {
			issues = new ArrayList<Issue>();
		}

		return getResults(issues, false);
	}

	@Override
	public List<IssueResult> getOpenedByList(String contactId) {
		long entityId = ConvertUtil.getLongId(contactId);
		List<Issue> issues = issueRepository.getOpenedByList(entityId);
		if (EntityUtil.isEmpltyList(issues)) {
			issues = new ArrayList<Issue>();
		}

		return getResults(issues, false);
	}

	@Override
	public List<IssueResult> getAssignedToList(String contactId) {
		long entityId = ConvertUtil.getLongId(contactId);
		List<Issue> issues = issueRepository.getAssignedToList(entityId);
		if (EntityUtil.isEmpltyList(issues)) {
			issues = new ArrayList<Issue>();
		}

		return getResults(issues, false);
	}

	@Override
	public List<IssueResult> reportEntities(IssueFilter filter) {
		String criteria = FilterUtil.getIssueReortQuery(filter);
		boolean isDefault = (Integer.parseInt(filter.getIsDefault()) == 1);
		if (!isDefault && criteria.length() > 0) {
			criteria = "where " + criteria;
		}
		List<Issue> issues = issueRepository.reportEntities("*", criteria);
		if (EntityUtil.isEmpltyList(issues)) {
			issues = new ArrayList<Issue>();
		}

		return getResults(issues, true);
	}

	@Override
	public String getQuery(Issue entity) {
		String query = "";
		if (entity.getCategory() != -1) {
			query = query + "iss.category = " + entity.getCategory() + " and ";
		}
		if (entity.getPriority() != -1) {
			query = query + "iss.priority = " + entity.getPriority() + " and ";
		}
		if (entity.getStatus() != -1) {
			query = query + "iss.status = " + entity.getStatus() + " and ";
		}
		if (EntityUtil.isValidString(entity.getPartNumber())) {
			query = query + "iss.partNum = '" + entity.getPartNumber()
					+ "' and ";
		}
		if (EntityUtil.isValidString(entity.getCustomterName())) {
			query = query + "iss.custName = '" + entity.getCustomterName()
					+ "' and ";
		}
		if (EntityUtil.isValidString(entity.getJobNumber())) {
			query = query + "iss.jobNum = '" + entity.getJobNumber() + "' and ";
		}
		if (EntityUtil.isValidString(entity.getPressNumber())) {
			query = query + "iss.pressNum = '" + entity.getPressNumber()
					+ "' and ";
		}
		if (EntityUtil.isValidString(entity.getMoldNumber())) {
			query = query + "iss.moldNum = '" + entity.getMoldNumber()
					+ "' and ";
		}
		if (EntityUtil.isValidString(entity.getFormulaNumber())) {
			query = query + "iss.formulaNum = '" + entity.getFormulaNumber()
					+ "' and ";
		}
		if (entity.getAssignedTo() != -1) {
			query = query + "iss.assignedTo = " + entity.getAssignedTo()
					+ " and ";
		}
		if (entity.getOpenedBy() != -1) {
			query = query + "iss.openedBy = " + entity.getOpenedBy();
		}

		if (EntityUtil.isValidString(query) && query.endsWith(" and ")) {
			query = query.substring(0, query.length() - " and ".length());
		}

		return query;
	}

	private List<IssueResult> getIssues(List<Issue> issues, boolean isDetail) {
		if (EntityUtil.isEmpltyList(issues)) {
			Issue issue = new Issue();
			issues.add(issue);
		}

		return getResults(issues, isDetail);
	}

	private List<HistoricalFix> getHistoricalFixes(long issueId,
			String partNumber) {

		return historicalFixRepository.getHistoricalFixes(issueId, partNumber);
	}

	private List<HistoricalProblem> getHistoricalProblems(long issueId,
			String partNumber) {

		return historicalProblemRepository.getHistoricalProblems(issueId,
				partNumber);
	}

	private void deletePhoto(Issue issue) {
		Photo photo = photoRepository.findOne(issue.getAttachment());
		if (photo != null) {
			photoRepository.delete(photo);
		}
	}

	private void deleteHistoricalFix(long issueId, String partNumber) {
		List<HistoricalFix> historicalFixes = getHistoricalFixes(issueId,
				partNumber);

		for (HistoricalFix entity : historicalFixes) {
			historicalFixRepository.delete(entity);
		}
	}

	private void deleteHistoricalProblem(long issueId, String partNumber) {
		List<HistoricalProblem> historicalProblems = getHistoricalProblems(
				issueId, partNumber);

		for (HistoricalProblem entity : historicalProblems) {
			historicalProblemRepository.delete(entity);
		}
	}

	private List<IssueResult> getResults(List<Issue> issues, boolean isDetail) {
		List<IssueResult> results = new ArrayList<IssueResult>();
		// Map<Long, IssueResult> resultMaps = new HashMap<Long, IssueResult>();

		for (Issue issue : issues) {
			IssueResult result = getResult(issue, isDetail);
			// resultMaps.put(result.getId(), result);
			results.add(result);
		}

		// Add related Issues
		// List<IssueResult> newResults = new ArrayList<IssueResult>();
		// for (IssueResult result : results) {
		// if (result.getRelatedIssueIdsList() != null
		// && result.getRelatedIssueIdsList().size() > 0) {
		// List<IssueResult> relatedIssues = new ArrayList<IssueResult>();
		// for (long id : result.getRelatedIssueIdsList()) {
		// IssueResult relatedIssue = resultMaps.get(id);
		// relatedIssues.add(relatedIssue);
		// }
		// result.setRelatedIssues(relatedIssues);
		// }
		// newResults.add(result);
		// }

		return results;
	}

	private List<IssueResult> getPartNumIssues(List<Issue> issues) {
		List<IssueResult> results = new ArrayList<IssueResult>();
		for (Issue issue : issues) {
			IssueResult result = getPartNumIssue(issue);
			results.add(result);
		}

		return results;
	}

	private IssueResult getPartNumIssue(Issue issue) {
		Contact contact = new Contact();
		Issue shortIssue = new Issue();
		List<HistoricalFix> historicalFixes = new ArrayList<HistoricalFix>();
		List<HistoricalProblem> historicalProblems = new ArrayList<HistoricalProblem>();

		shortIssue.setId(issue.getId());
		shortIssue.setPartNumber(issue.getPartNumber());
		shortIssue.setCustomterName(issue.getCustomterName());

		IssueResult result = ConvertUtil.issueConverter(shortIssue,
				new Category(), new Priority(), new Status(), contact, contact,
				historicalProblems, historicalFixes);

		return result;
	}

	private IssueResult getResult(Issue issue, boolean isDetail) {
		Status status = statusRepository.findOne(issue.getStatus());
		Contact openedBy = contactRepository.findOne(issue.getOpenedBy());
		Category category = categoryRepository.findOne(issue.getCategory());
		Priority priority = priorityRepository.findOne(issue.getPriority());
		Contact assignedTo = contactRepository.findOne(issue.getAssignedTo());
		List<HistoricalFix> historicalFixes = new ArrayList<HistoricalFix>();
		List<HistoricalProblem> historicalProblems = new ArrayList<HistoricalProblem>();
		if (isDetail) {
			historicalFixes = getHistoricalFixes(issue.getId(),
					issue.getPartNumber());
			historicalProblems = getHistoricalProblems(issue.getId(),
					issue.getPartNumber());
		}

		IssueResult result = ConvertUtil.issueConverter(issue, category,
				priority, status, assignedTo, openedBy, historicalProblems,
				historicalFixes);

		return result;
	}

	private List<IssueResult> getRelatedIssues(String relatedIssueIds) {
		List<IssueResult> results = new ArrayList<IssueResult>();
		String relatedIssues[] = relatedIssueIds.replace("[", "")
				.replace("]", "").split(",");
		for (String strId : relatedIssues) {
			long entityId = ConvertUtil.getLongId(strId.trim());
			Issue issue = issueRepository.findOne(entityId);
			if (issue != null) {
				IssueResult result = getResult(issue, false);
				results.add(result);
			}
		}

		return results;
	}

	private void addNewHistoricalProblem(long issueId, String problem,
			String partNumber) {
		System.out.println(">> Start addNewHistoricalProblem method ...");

		String versionProblem = ConvertUtil.getVersion();
		if (EntityUtil.isValidString(problem)) {
			versionProblem = versionProblem + " " + problem;
			System.out.println("versionProblem: " + versionProblem);

			HistoricalProblem hp = new HistoricalProblem();
			hp.setIssueID(issueId);
			hp.setVersionProblem(versionProblem);
			hp.setPartNumber(partNumber);
			historicalProblemRepository.create(hp);
		}

		System.out.println(">> End addNewHistoricalProblem method ...");
	}

	private void addNewHistoricalFix(long issueId, String fix, String partNumber) {
		System.out.println(">> Start addNewHistoricalFix method ...");

		String versionFix = ConvertUtil.getVersion();
		if (EntityUtil.isValidString(fix)) {
			versionFix = versionFix + " " + fix;
			System.out.println("versionFix: " + versionFix);

			HistoricalFix hf = new HistoricalFix();
			hf.setIssueID(issueId);
			hf.setVersionFix(versionFix);
			hf.setPartNumber(partNumber);
			historicalFixRepository.create(hf);
		}

		System.out.println(">> End addNewHistoricalFix method ...");
	}

	public void setIssueRepository(IssueRepository issueRepository) {
		this.issueRepository = issueRepository;
	}

	public void setPhotoRepository(CRUDRepository<Photo> photoRepository) {
		this.photoRepository = photoRepository;
	}

	public void setStatusRepository(CRUDRepository<Status> statusRepository) {
		this.statusRepository = statusRepository;
	}

	public void setContactRepository(CRUDRepository<Contact> contactRepository) {
		this.contactRepository = contactRepository;
	}

	public void setCategoryRepository(
			CRUDRepository<Category> categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	public void setPriorityRepository(
			CRUDRepository<Priority> priorityRepository) {
		this.priorityRepository = priorityRepository;
	}

	public void setHistoricalFixRepository(
			HistoricalFixRepository historicalFixRepository) {
		this.historicalFixRepository = historicalFixRepository;
	}

	public void setHistoricalProblemRepository(
			HistoricalProblemRepository historicalProblemRepository) {
		this.historicalProblemRepository = historicalProblemRepository;
	}
}
