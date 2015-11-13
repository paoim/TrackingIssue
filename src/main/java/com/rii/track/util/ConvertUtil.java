package com.rii.track.util;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;

import com.rii.track.model.Category;
import com.rii.track.model.Contact;
import com.rii.track.model.HistoricalFix;
import com.rii.track.model.HistoricalProblem;
import com.rii.track.model.Issue;
import com.rii.track.model.PartCustomer;
import com.rii.track.model.Photo;
import com.rii.track.model.Priority;
import com.rii.track.model.Status;
import com.rii.track.model.Todo;
import com.rii.track.service.model.CategoryResult;
import com.rii.track.service.model.ContactResult;
import com.rii.track.service.model.HistoricalFixResult;
import com.rii.track.service.model.HistoricalProblemResult;
import com.rii.track.service.model.IssueResult;
import com.rii.track.service.model.PhotoResult;
import com.rii.track.service.model.PriorityResult;
import com.rii.track.service.model.StatusResult;
import com.rii.track.service.model.TodoResult;

public class ConvertUtil {

	public static int getIntId(String id) {
		int intId = 0;

		try {
			intId = Integer.parseInt(id);
		} catch (Exception e) {
			intId = 0;
		}

		return intId;
	}

	public static long getLongId(String id) {
		long longId = -1;

		try {
			longId = Long.parseLong(id);
		} catch (Exception e) {
			longId = -1;
		}

		return longId;
	}

	public static String getVersion() {
		DateFormatUtil dateFormate = new DateFormatUtil(DateFormatUtil.SLAS_MMDDYYYYHHMMSSA);
		String version = "[Version: " + dateFormate.formateToday() + "]";

		return version;
	}

	public static Date getYYYYMMDDDate(String strDate) {
		DateFormatUtil dateFormate = new DateFormatUtil(DateFormatUtil.DAS_YYYYMMDD);

		return dateFormate.getDateFormat(strDate);
	}

	public static Date getMMDDYYYYDate(String strDate) {
		DateFormatUtil dateFormate = new DateFormatUtil(DateFormatUtil.SLAS_MMDDYYYY);

		return dateFormate.getDateFormat(strDate);
	}

	public static Date getMMDDYYYYHHMMSSADate(String strDate) {
		DateFormatUtil dateFormate = new DateFormatUtil(DateFormatUtil.SLAS_MMDDYYYYHHMMSSA);

		return dateFormate.getDateFormat(strDate);
	}

	public static Response getPhotoResponse(byte[] imageData) {
		Response respone = Response.noContent().build();
		if (imageData != null && imageData.length > 0) {
			respone = Response.ok(imageData,
					MediaType.APPLICATION_OCTET_STREAM_TYPE).build();
		}

		return respone;
	}

	public static TodoResult todoConverter(Todo entity, Contact contact) {
		TodoResult result = new TodoResult();

		result.setId(entity.getId());
		result.setWho(entity.getWho());
		result.setWhat(entity.getWhat());
		result.setCompleted(entity.getIsCompleted() > 0);
		result.setDueDate(entity.getDueDate());
		result.setIssueID(entity.getIssueID());
		result.setPartNum(entity.getPartNumber());

		String contactName = "";
		if (EntityUtil.isValidString(contact.getFirstName())) {
			contactName = contact.getFirstName();
		}
		if (EntityUtil.isValidString(contact.getLastName())) {
			contactName = EntityUtil.isValidString(contactName) ? contactName
					+ " " + contact.getLastName() : contact.getLastName();
		}
		result.setContact(contactName);

		return result;
	}

	public static Issue issueConverter(Issue entity, List<Issue> relatedIssues,
			String relatedIssueIds) {
		Issue newIssue = new Issue();
		newIssue.setId(entity.getId());
		newIssue.setPartNumber(entity.getPartNumber());
		newIssue.setCustomterName(entity.getCustomterName());
		newIssue.setJobNumber(entity.getJobNumber());
		newIssue.setPressNumber(entity.getPressNumber());
		newIssue.setMoldNumber(entity.getMoldNumber());
		newIssue.setFormulaNumber(entity.getFormulaNumber());
		newIssue.setAssignedTo(entity.getAssignedTo());
		newIssue.setOpenedBy(entity.getOpenedBy());
		newIssue.setOpenedDate(entity.getOpenedDate());
		newIssue.setStatus(entity.getStatus());
		newIssue.setCategory(entity.getCategory());
		newIssue.setPriority(entity.getPriority());
		newIssue.setFix(entity.getFix());
		newIssue.setDueDate(entity.getDueDate());
		newIssue.setRelatedIssues(relatedIssues);
		newIssue.setRelatedIssueIds(relatedIssueIds);
		newIssue.setProblem(entity.getProblem());
		newIssue.setAttachment(entity.getAttachment());
		newIssue.setFollowUntil(entity.getFollowUntil());

		return newIssue;
	}

	public static IssueResult issueConverter(Issue issue, Category category,
			Priority priority, Status status, Contact assignedTo,
			Contact openedBy, List<HistoricalProblem> historicalProblems,
			List<HistoricalFix> historicalFixes) {
		IssueResult result = new IssueResult();
		result.setId(issue.getId());
		result.setPartNumber(issue.getPartNumber());
		result.setCustomterName(issue.getCustomterName());

		if (issue.getJobNumber() != null) {
			result.setJobNumber(issue.getJobNumber());
		}

		if (issue.getPressNumber() != null) {
			result.setPressNumber(issue.getPressNumber());
		}

		if (issue.getMoldNumber() != null) {
			result.setMoldNumber(issue.getMoldNumber());
		}

		if (issue.getFormulaNumber() != null) {
			result.setFormulaNumber(issue.getFormulaNumber());
		}

		if (issue.getOpenedDate() != null) {
			result.setOpenedDate(issue.getOpenedDate());
		}

		if (issue.getDueDate() != null) {
			result.setDueDate(issue.getDueDate());
		}

		if (issue.getFollowUntil() != null) {
			result.setFollowUntil(issue.getFollowUntil());
		}

		if (issue.getProblem() != null) {
			result.setProblem(issue.getProblem());
		}

		if (issue.getFix() != null) {
			result.setFix(issue.getFix());
		}

		if (issue.getAttachment() > 0) {
			result.setAttachment(issue.getAttachment());
		}

		if (issue.getRelatedIssueIds() != null) {
			result.setRelatedIssueIds(issue.getRelatedIssueIds());
			result.setRelatedIssueIdsList(getRelatedIssueIds(issue
					.getRelatedIssueIds()));
		}

		if (EntityUtil.isNotNullEntity(assignedTo)) {
			ContactResult assignedToResult = contactConverter(assignedTo);
			result.setAssignedTo(assignedToResult);
		}

		if (EntityUtil.isNotNullEntity(openedBy)) {
			ContactResult openedByResult = contactConverter(openedBy);
			result.setOpenedBy(openedByResult);
		}

		if (EntityUtil.isValidList(historicalProblems)) {
			result.setHistoricalProblems(historicalProblemsConverter(historicalProblems));
		}

		if (EntityUtil.isValidList(historicalFixes)) {
			result.setHistoricalFixes(historicalFixesConverter(historicalFixes));
		}

		if (EntityUtil.isNotNullEntity(category)) {
			result.setCategory(categoryConverter(category));
		}

		if (EntityUtil.isNotNullEntity(priority)) {
			result.setPriority(priorityConverter(priority));
		}

		if (EntityUtil.isNotNullEntity(status)) {
			result.setStatus(statusConverter(status));
		}

		return result;
	}

	public static List<Long> getRelatedIssueIds(String relatedIssueIds) {
		List<Long> riIds = new ArrayList<Long>();
		String relatedIssues[] = relatedIssueIds.replace("[", "")
				.replace("]", "").split(",");
		for (String strId : relatedIssues) {
			long entityId = ConvertUtil.getLongId(strId.trim());
			riIds.add(entityId);
		}

		return riIds;
	}

	public static PhotoResult photoConverter(Photo photo, String imageLocation) {
		PhotoResult result = new PhotoResult();
		result.setId(photo.getId());
		result.setImageLocation(imageLocation);

		return result;
	}

	public static CategoryResult categoryConverter(Category category) {
		CategoryResult result = new CategoryResult();
		if (EntityUtil.isNotNullEntity(category)) {
			result.setId(category.getId());
			result.setName(category.getName());
		}

		return result;
	}

	public static PriorityResult priorityConverter(Priority priority) {
		PriorityResult result = new PriorityResult();
		if (EntityUtil.isNotNullEntity(priority)) {
			result.setId(priority.getId());
			result.setName(priority.getName());
		}

		return result;
	}

	public static StatusResult statusConverter(Status status) {
		StatusResult result = new StatusResult();
		if (EntityUtil.isNotNullEntity(status)) {
			result.setId(status.getId());
			result.setName(status.getName());
		}

		return result;
	}

	public static ContactResult contactConverter(Contact contact) {
		ContactResult contactResult = new ContactResult();
		if (EntityUtil.isNotNullEntity(contact)) {
			contactResult.setId(contact.getId());
			contactResult.setFirstName(contact.getFirstName());
			contactResult.setLastName(contact.getLastName());
		}

		return contactResult;
	}

	public static HistoricalProblemResult historicalProblemConverter(
			HistoricalProblem hp) {
		HistoricalProblemResult result = new HistoricalProblemResult();
		if (EntityUtil.isNotNullEntity(hp)) {
			result.setId(hp.getId());
			result.setIssueID(hp.getIssueID());
			result.setVersionProblem(hp.getVersionProblem());
			result.setPartNum(hp.getPartNumber());
		}

		return result;
	}

	public static HistoricalFixResult historicalFixConverter(HistoricalFix hf) {
		HistoricalFixResult result = new HistoricalFixResult();
		if (EntityUtil.isNotNullEntity(hf)) {
			result.setId(hf.getId());
			result.setIssueID(hf.getIssueID());
			result.setVersionFix(hf.getVersionFix());
			result.setPartNum(hf.getPartNumber());
		}

		return result;
	}

	public static List<HistoricalProblemResult> historicalProblemsConverter(
			List<HistoricalProblem> entities) {
		List<HistoricalProblemResult> results = new ArrayList<HistoricalProblemResult>();
		if (EntityUtil.isValidList(entities)) {
			for (HistoricalProblem hp : entities) {
				HistoricalProblemResult result = historicalProblemConverter(hp);
				results.add(result);
			}
		}

		return results;
	}

	public static List<HistoricalFixResult> historicalFixesConverter(
			List<HistoricalFix> entities) {
		List<HistoricalFixResult> results = new ArrayList<HistoricalFixResult>();
		if (EntityUtil.isValidList(entities)) {
			for (HistoricalFix hf : entities) {
				HistoricalFixResult result = historicalFixConverter(hf);
				results.add(result);
			}
		}

		return results;
	}

	public static HistoricalProblem getUpdateHistoricalProblem(long id,
			HistoricalProblem historicalPro) {
		HistoricalProblem hp = new HistoricalProblem();
		hp.setId(id);
		hp.setIssueID(historicalPro.getIssueID());
		hp.setVersionProblem(historicalPro.getVersionProblem());
		hp.setPartNumber(historicalPro.getPartNumber());

		return hp;
	}

	public static HistoricalFix getUpdateHistoricalFix(long id,
			HistoricalFix historicalFix) {
		HistoricalFix hf = new HistoricalFix();
		hf.setId(id);
		hf.setIssueID(historicalFix.getIssueID());
		hf.setVersionFix(historicalFix.getVersionFix());
		hf.setPartNumber(historicalFix.getPartNumber());

		return hf;
	}

	public static PartCustomer getUpdatePartCustomer(long id, PartCustomer pc) {
		PartCustomer partCustomer = new PartCustomer();
		partCustomer.setId(id);
		partCustomer.setCustId(pc.getCustId());
		partCustomer.setCustNum(pc.getCustNum());
		partCustomer.setCustName(pc.getCustName());
		partCustomer.setPartNum(pc.getPartNum());
		partCustomer.setPartDescription(pc.getPartDescription());

		return partCustomer;
	}

	public static Issue getUpdateIssue(long id, Issue issue) {
		Issue result = new Issue();
		result.setId(id);
		result.setPartNumber(issue.getPartNumber());
		result.setCustomterName(issue.getCustomterName());
		result.setJobNumber(issue.getJobNumber());
		result.setPressNumber(issue.getPressNumber());
		result.setMoldNumber(issue.getMoldNumber());
		result.setFormulaNumber(issue.getFormulaNumber());
		result.setOpenedDate(issue.getOpenedDate());
		result.setDueDate(issue.getDueDate());
		result.setFollowUntil(issue.getFollowUntil());
		result.setProblem(issue.getProblem());
		result.setFix(issue.getFix());
		result.setRelatedIssueIds(issue.getRelatedIssueIds());
		result.setAssignedTo(issue.getAssignedTo());
		result.setOpenedBy(issue.getOpenedBy());
		result.setCategory(issue.getCategory());
		result.setPriority(issue.getPriority());
		result.setStatus(issue.getStatus());
		result.setAttachment(issue.getAttachment());

		return result;
	}

	public static Contact getUpdateContact(long id, Contact contact) {
		Contact result = new Contact();
		result.setId(id);
		result.setFirstName(contact.getFirstName());
		result.setLastName(contact.getLastName());
		result.setCompany(contact.getCompany());
		result.setEmailAddress(contact.getEmailAddress());
		result.setJobTitle(contact.getJobTitle());
		result.setBusinessPhone(contact.getBusinessPhone());
		result.setHomePhone(contact.getHomePhone());
		result.setMobilePhone(contact.getMobilePhone());
		result.setFaxNumber(contact.getFaxNumber());
		result.setAddress(contact.getAddress());
		result.setCity(contact.getCity());
		result.setStateProvince(contact.getStateProvince());
		result.setZipPostalCode(contact.getZipPostalCode());
		result.setCountryRegion(contact.getCountryRegion());
		result.setWebPage(contact.getWebPage());
		result.setNote(contact.getNote());
		result.setAttachment(contact.getAttachment());

		return result;
	}

	public static Category getUpdateCategory(long id, Category entity) {
		Category result = new Category();
		result.setId(id);
		result.setName(entity.getName());
		result.setDescription(entity.getDescription());

		return result;
	}

	public static Priority getUpdatePriory(long id, Priority entity) {
		Priority result = new Priority();
		result.setId(id);
		result.setName(entity.getName());
		result.setDescription(entity.getDescription());

		return result;
	}

	public static Status getUpdateStatus(long id, Status entity) {
		Status result = new Status();
		result.setId(id);
		result.setName(entity.getName());
		result.setDescription(entity.getDescription());

		return result;
	}

	public static Todo getUpdateTodo(long id, Todo entity) {
		Todo result = new Todo();
		result.setId(entity.getId());
		result.setWho(entity.getWho());
		result.setWhat(entity.getWhat());
		result.setIsCompleted(entity.getIsCompleted());
		result.setDueDate(entity.getDueDate());
		result.setIssueID(entity.getIssueID());
		result.setPartNumber(entity.getPartNumber());

		return result;
	}

	public static List<HistoricalProblem> convertExcelHistoricalProblem(
			List<Row> rowList) {
		List<HistoricalProblem> historicalProblems = new ArrayList<HistoricalProblem>();
		for (Row row : rowList) {
			Cell cell = row.getCell(0);// ID
			long id = getCellLongValue(cell);

			if (id != -1) {
				cell = row.getCell(1);// Issue ID
				long issueId = getCellLongValue(cell);
				// System.out.println("IssueID: " + issueId);

				cell = row.getCell(2);// comments
				String comments = getCellStringValue(cell);
				if (EntityUtil.isValidString(comments)) {
					comments = comments.replace("_x000d_", "");
					// System.out.println(comments);
				}

				cell = row.getCell(3);// history
				String history = getCellStringValue(cell);
				if (EntityUtil.isValidString(history)) {
					// System.out.println("===========================" +
					// issueId
					// + "===============================");
					history = history.replace("_x000d_", "");
					String lines[] = history.split("\\r?\\n");
					// for (int i = 0; i < lines.length; i++) {
					// String line = lines[i];
					// line = line.replace("_x000d_", "");
					// line = line.replace("<div>&nbsp;</div>", "");
					// line = line.replace("<div>&nbsp;</div>_x000d_", "");
					// System.out.println("[" + i + "]: " + line);
					// }

					for (String str : lines) {
						String line = str;
						if (EntityUtil.isValidString(line)) {
							line = line.replace("_x000d_", "");
							line = line.replace("<div>&nbsp;</div>", "");
							line = line.replace("<div>&nbsp;</div>_x000d_", "");

							HistoricalProblem historicalProblem = new HistoricalProblem();
							historicalProblem.setIssueID(issueId);
							historicalProblem.setVersionProblem(line);
							// TODO: need to add partNumber

							historicalProblems.add(historicalProblem);
						}
					}
				}

				cell = row.getCell(4);// description
				String description = getCellStringValue(cell);
				if (EntityUtil.isValidString(description)) {
					System.out.println(description);
				}

				cell = row.getCell(5);// partNum
				String partNumber = getCellStringValue(cell);
				if (EntityUtil.isValidString(partNumber)) {
					System.out.println(partNumber);
				}
			}
		}

		return historicalProblems;
	}

	public static List<HistoricalFix> convertExcelHistoricalFix(
			List<Row> rowList) {
		List<HistoricalFix> historicalFixes = new ArrayList<HistoricalFix>();
		for (Row row : rowList) {
			Cell cell = row.getCell(0);// ID
			long id = getCellLongValue(cell);

			if (id != -1) {
				cell = row.getCell(1);// Issue ID
				long issueId = getCellLongValue(cell);
				// System.out.println("IssueID: " + issueId);

				cell = row.getCell(2);// comments
				String comments = getCellStringValue(cell);
				if (EntityUtil.isValidString(comments)) {
					comments = comments.replace("_x000d_", "");
					// System.out.println(comments);
				}

				cell = row.getCell(3);// history
				String history = getCellStringValue(cell);
				if (EntityUtil.isValidString(history)) {
					// System.out.println("===========================" +
					// issueId
					// + "===============================");
					history = history.replace("_x000d_", "");
					String lines[] = history.split("\\r?\\n");
					// for (int i = 0; i < lines.length; i++) {
					// String line = lines[i];
					// line = line.replace("_x000d_", "");
					// line = line.replace("<div>&nbsp;</div>", "");
					// line = line.replace("<div>&nbsp;</div>_x000d_", "");
					// System.out.println("[" + i + "]: " + line);
					// }

					for (String str : lines) {
						String line = str;
						if (EntityUtil.isValidString(line)) {
							line = line.replace("_x000d_", "");
							line = line.replace("<div>&nbsp;</div>", "");
							line = line.replace("<div>&nbsp;</div>_x000d_", "");

							HistoricalFix historicalFix = new HistoricalFix();
							historicalFix.setIssueID(issueId);
							historicalFix.setVersionFix(line);
							// TODO: need to add partNumber

							historicalFixes.add(historicalFix);
						}
					}
				}

				cell = row.getCell(4);// description
				String description = getCellStringValue(cell);
				if (EntityUtil.isValidString(description)) {
					System.out.println(description);
				}

				cell = row.getCell(5);// partNum
				String partNumber = getCellStringValue(cell);
				if (EntityUtil.isValidString(partNumber)) {
					System.out.println(partNumber);
				}
			}
		}

		return historicalFixes;
	}

	public static List<HistoricalProblem> readExcelHistoricalProblem(
			List<Row> rowList) {
		List<HistoricalProblem> historicalProblems = new ArrayList<HistoricalProblem>();
		for (Row row : rowList) {
			HistoricalProblem historicalProblem = new HistoricalProblem();
			Cell cell = row.getCell(0);// Issue ID
			long issueId = getCellLongValue(cell);

			if (issueId != -1) {
				historicalProblem.setIssueID(issueId);

				cell = row.getCell(1);// version
				String version = getCellStringValue(cell);

				cell = row.getCell(2);// comment
				String comment = getCellStringValue(cell);

				if (EntityUtil.isValidString(version)
						|| EntityUtil.isValidString(comment)) {
					comment = comment.replace("_x000d_", "");
					String versionComment = (EntityUtil.isValidString(version) ? version
							: "")
							+ " "
							+ (EntityUtil.isValidString(comment) ? comment : "");
					historicalProblem.setVersionProblem(versionComment);
				}

				/*
				 * cell = row.getCell(3);// description String description =
				 * getCellStringValue(cell); if
				 * (EntityUtil.isValidString(description)) {
				 * historicalProblem.setDescription(description); }
				 */

				// TODO: need to add partNumber

				historicalProblems.add(historicalProblem);
			}
		}

		return historicalProblems;
	}

	public static List<HistoricalFix> readExcelHistoricalFix(List<Row> rowList) {
		List<HistoricalFix> historicalFixes = new ArrayList<HistoricalFix>();
		for (Row row : rowList) {
			HistoricalFix historicalFix = new HistoricalFix();
			Cell cell = row.getCell(0);// Issue ID
			long issueId = getCellLongValue(cell);

			if (issueId != -1) {
				historicalFix.setIssueID(issueId);

				cell = row.getCell(1);// version
				String version = getCellStringValue(cell);

				cell = row.getCell(2);// comment
				String comment = getCellStringValue(cell);

				if (EntityUtil.isValidString(version)
						|| EntityUtil.isValidString(comment)) {
					comment = comment.replace("_x000d_", "");
					String versionComment = (EntityUtil.isValidString(version) ? version
							: "")
							+ " "
							+ (EntityUtil.isValidString(comment) ? comment : "");
					historicalFix.setVersionFix(versionComment);
				}

				/*
				 * cell = row.getCell(3);// description String description =
				 * getCellStringValue(cell); if
				 * (EntityUtil.isValidString(description)) {
				 * historicalFix.setDescription(description); }
				 */

				// TODO: need to add partNumber

				historicalFixes.add(historicalFix);
			}
		}

		return historicalFixes;
	}

	public static List<PartCustomer> convertExcelPartCustomer(List<Row> rowList) {
		List<PartCustomer> partCustomers = new ArrayList<PartCustomer>();
		for (Row row : rowList) {
			PartCustomer partCustomer = new PartCustomer();
			Cell cell = row.getCell(0);// CustNum
			long custNum = getCellLongValue(cell);
			if (custNum != -1) {
				partCustomer.setCustNum(custNum);

				cell = row.getCell(1);// Name
				String name = getCellStringValue(cell);
				if (EntityUtil.isValidString(name)) {
					partCustomer.setCustName(name);
				}

				cell = row.getCell(2);// CustID
				String custId = getCellStringValue(cell);
				if (EntityUtil.isValidString(custId)) {
					partCustomer.setCustId(custId);
				}

				cell = row.getCell(3);// PartNum
				String partNum = getCellStringValue(cell);
				if (EntityUtil.isValidString(partNum)) {
					partCustomer.setPartNum(partNum);
				}

				cell = row.getCell(4);// PartDescription
				String description = getCellStringValue(cell);
				if (EntityUtil.isValidString(description)) {
					partCustomer.setPartDescription(description);
				}

				partCustomers.add(partCustomer);
			}
		}

		return partCustomers;
	}

	public static List<Category> convertExcelCategory(List<Row> rowList) {
		List<Category> categories = new ArrayList<Category>();
		for (Row row : rowList) {
			Category category = new Category();
			Cell cell = row.getCell(0);// ID
			long categoryId = getCellLongValue(cell);

			if (categoryId != -1) {
				cell = row.getCell(1);// Name
				String name = getCellStringValue(cell);
				if (EntityUtil.isValidString(name)) {
					category.setName(name);
				}

				cell = row.getCell(2);// Description
				String description = getCellStringValue(cell);
				if (EntityUtil.isValidString(description)) {
					category.setDescription(description);
				}

				categories.add(category);
			}
		}

		return categories;
	}

	public static List<Priority> convertExcelPriority(List<Row> rowList) {
		List<Priority> priorities = new ArrayList<Priority>();
		for (Row row : rowList) {
			Priority priority = new Priority();
			Cell cell = row.getCell(0);// ID
			long priorityId = getCellLongValue(cell);

			if (priorityId != -1) {
				cell = row.getCell(1);// Name
				String name = getCellStringValue(cell);
				if (EntityUtil.isValidString(name)) {
					priority.setName(name);
				}

				cell = row.getCell(2);// Description
				String description = getCellStringValue(cell);
				if (EntityUtil.isValidString(description)) {
					priority.setDescription(description);
				}

				priorities.add(priority);
			}
		}

		return priorities;
	}

	public static List<Status> convertExcelStatus(List<Row> rowList) {
		List<Status> statusItems = new ArrayList<Status>();
		for (Row row : rowList) {
			Status status = new Status();
			Cell cell = row.getCell(0);// ID
			long statusId = getCellLongValue(cell);

			if (statusId != -1) {
				cell = row.getCell(1);// Name
				String name = getCellStringValue(cell);
				if (EntityUtil.isValidString(name)) {
					status.setName(name);
				}

				cell = row.getCell(2);// Description
				String description = getCellStringValue(cell);
				if (EntityUtil.isValidString(description)) {
					status.setDescription(description);
				}

				statusItems.add(status);
			}
		}

		return statusItems;
	}

	public static List<Issue> convertExcelIssue(List<Row> rowList) {
		List<Issue> issues = new ArrayList<Issue>();
		for (Row row : rowList) {
			Issue issue = new Issue();
			Cell cell = row.getCell(0);// ID
			long issueId = getCellLongValue(cell);

			if (issueId > 0) {
				issue.setIssueIdFromExcel(issueId); // ISSUE_ID from excel

				cell = row.getCell(1);// PartNum
				String partNum = getCellStringValue(cell);
				if (EntityUtil.isValidString(partNum)) {
					issue.setPartNumber(partNum);
				}

				cell = row.getCell(2);// Customer Name
				String custName = getCellStringValue(cell);
				if (EntityUtil.isValidString(custName)) {
					issue.setCustomterName(custName);
				}

				cell = row.getCell(3);// JobNum
				String jobNum = getCellStringValue(cell);
				if (EntityUtil.isValidString(jobNum)) {
					issue.setJobNumber(jobNum);
				}

				cell = row.getCell(4);// PressNum
				String pressNum = getCellStringValue(cell);
				if (EntityUtil.isValidString(pressNum)) {
					issue.setPressNumber(pressNum);
				}

				cell = row.getCell(5);// moldNum
				String moldNum = getCellStringValue(cell);
				if (EntityUtil.isValidString(moldNum)) {
					issue.setMoldNumber(moldNum);
				}

				cell = row.getCell(6);// formulaNum
				String formulaNum = getCellStringValue(cell);
				if (EntityUtil.isValidString(formulaNum)) {
					issue.setFormulaNumber(formulaNum);
				}

				cell = row.getCell(7);// assignedTo
				long assignedTo = getCellLongValue(cell);
				if (assignedTo != -1) {
					issue.setAssignedTo(assignedTo);
				}

				cell = row.getCell(8);// openedBy
				long openedBy = getCellLongValue(cell);
				if (openedBy != -1) {
					issue.setOpenedBy(openedBy);
				}

				cell = row.getCell(9);// openedDate
				Date openedDate = getCellDateValue(cell);
				if (openedDate != null) {
					issue.setOpenedDate(openedDate);
				}

				cell = row.getCell(10);// status
				String status = getCellStringValue(cell);
				if (EntityUtil.isValidString(status)) {
					long statusId = getStatus(status);
					if (statusId != -1) {
						issue.setStatus(statusId);
					}
				}

				cell = row.getCell(11);// category
				String category = getCellStringValue(cell);
				if (EntityUtil.isValidString(category)) {
					long categoryId = getCategory(category);
					if (categoryId != -1) {
						issue.setCategory(categoryId);
					}
				}

				cell = row.getCell(12);// priority
				String priority = getCellStringValue(cell);
				if (EntityUtil.isValidString(priority)) {
					long priorityId = getPriority(priority);
					if (priorityId != -1) {
						issue.setPriority(priorityId);
					}
				}

				cell = row.getCell(13);// description
				String description = getCellStringValue(cell);
				if (EntityUtil.isValidString(description)) {
					issue.setFix(description);
				}

				cell = row.getCell(14);// dueDate
				Date dueDate = getCellDateValue(cell);
				if (dueDate != null) {
					issue.setDueDate(dueDate);
				}

				cell = row.getCell(15);// relatedIssue_IDs
				String relatedIssueIds = getCellStringValue(cell);
				if (EntityUtil.isValidString(relatedIssueIds)) {
					relatedIssueIds = relatedIssueIds.replace(";", ",");
					issue.setRelatedIssueIds(relatedIssueIds);
				}

				cell = row.getCell(16);// comments
				String comments = getCellStringValue(cell);
				if (EntityUtil.isValidString(comments)) {
					issue.setProblem(comments);
				}

				cell = row.getCell(17);// followUntil
				Date followUntil = getCellDateValue(cell);
				if (followUntil != null) {
					issue.setFollowUntil(followUntil);
				}

				// cell = row.getCell(18);// Attachments
				// issue.setAttachment(getCellStringValue(cell));

				issues.add(issue);
			}
		}

		return issues;
	}

	public static List<Contact> convertExcelContact(List<Row> rowList) {
		List<Contact> contacts = new ArrayList<Contact>();
		for (Row row : rowList) {
			Contact contact = new Contact();
			Cell cell = row.getCell(0);// ID
			long contactId = getCellLongValue(cell);

			if (contactId != -1) {
				cell = row.getCell(1);// First Name
				String firstName = getCellStringValue(cell);
				if (EntityUtil.isValidString(firstName)) {
					contact.setFirstName(firstName);
				}

				cell = row.getCell(2);// Last Name
				String lastName = getCellStringValue(cell);
				if (EntityUtil.isValidString(lastName)) {
					contact.setLastName(lastName);
				}

				cell = row.getCell(3);// Company
				String company = getCellStringValue(cell);
				if (EntityUtil.isValidString(company)) {
					contact.setCompany(company);
				}

				cell = row.getCell(4);// E-mail
				String email = getCellStringValue(cell);
				if (EntityUtil.isValidString(email)) {
					contact.setEmailAddress(email);
				}

				cell = row.getCell(5);// Job Title
				String jobTitle = getCellStringValue(cell);
				if (EntityUtil.isValidString(jobTitle)) {
					contact.setJobTitle(jobTitle);
				}

				cell = row.getCell(6);// Business Phone
				String businessPhone = getCellStringValue(cell);
				if (EntityUtil.isValidString(businessPhone)) {
					contact.setBusinessPhone(businessPhone);
				}

				cell = row.getCell(7);// Home Phone
				String homePhone = getCellStringValue(cell);
				if (EntityUtil.isValidString(homePhone)) {
					contact.setHomePhone(homePhone);
				}

				cell = row.getCell(8);// Mobile Phone
				String mobilePhone = getCellStringValue(cell);
				if (EntityUtil.isValidString(mobilePhone)) {
					contact.setMobilePhone(mobilePhone);
				}

				cell = row.getCell(9);// Fax Number
				String faxNumber = getCellStringValue(cell);
				if (EntityUtil.isValidString(faxNumber)) {
					contact.setFaxNumber(faxNumber);
				}

				cell = row.getCell(10);// Address
				String address = getCellStringValue(cell);
				if (EntityUtil.isValidString(address)) {
					contact.setAddress(address);
				}

				cell = row.getCell(11);// City
				String city = getCellStringValue(cell);
				if (EntityUtil.isValidString(city)) {
					contact.setCity(city);
				}

				cell = row.getCell(12);// State/Province
				String stateProvince = getCellStringValue(cell);
				if (EntityUtil.isValidString(stateProvince)) {
					contact.setStateProvince(stateProvince);
				}

				cell = row.getCell(13);// Zip/Postal COde
				String zipCode = getCellStringValue(cell);
				if (EntityUtil.isValidString(zipCode)) {
					contact.setZipPostalCode(zipCode);
				}

				cell = row.getCell(14);// Country Region
				String country = getCellStringValue(cell);
				if (EntityUtil.isValidString(country)) {
					contact.setCountryRegion(country);
				}

				cell = row.getCell(15);// Web Page
				String webPage = getCellStringValue(cell);
				if (EntityUtil.isValidString(webPage)) {
					contact.setWebPage(webPage);
				}

				cell = row.getCell(16);// Note
				String note = getCellStringValue(cell);
				if (EntityUtil.isValidString(note)) {
					contact.setNote(note);
				}

				// cell = row.getCell(17);// Attachments
				// contact.setAttachment(getCellStringValue(cell));

				contacts.add(contact);
			}
		}

		return contacts;
	}

	public static long getCategory(String category) {
		long result = -1;
		if ("(1) Category".equalsIgnoreCase(category)) {
			result = 1;
		} else if ("(2) Category".equalsIgnoreCase(category)) {
			result = 2;
		} else if ("(3) Category".equalsIgnoreCase(category)) {
			result = 3;
		}

		return result;
	}

	public static long getPriority(String priority) {
		long result = -1;
		if ("(1) High".equalsIgnoreCase(priority)) {
			result = 1;
		} else if ("(2) Normal".equalsIgnoreCase(priority)) {
			result = 2;
		} else if ("(3) Low".equalsIgnoreCase(priority)) {
			result = 3;
		}

		return result;
	}

	public static long getStatus(String status) {
		long result = -1;
		if ("Active".equalsIgnoreCase(status)) {
			result = 1;
		} else if ("Resolved".equalsIgnoreCase(status)) {
			result = 2;
		} else if ("Closed".equalsIgnoreCase(status)) {
			result = 3;
		}

		return result;
	}

	public static String getCellStringValue(Cell cell) {
		String cellString = "";
		if (cell != null) {
			switch (cell.getCellType()) {
			case Cell.CELL_TYPE_STRING:
				cellString = cell.getStringCellValue();
				break;
			case Cell.CELL_TYPE_NUMERIC:
				cellString = "" + cell.getNumericCellValue();
				break;
			}
		}

		// remove space
		if (EntityUtil.isValidString(cellString)) {
			cellString = cellString.trim();
		}

		return cellString;
	}

	public static Date getCellDateValue(Cell cell) {
		Date date = null;
		if (cell != null) {
			if (cell.getCellType() == Cell.CELL_TYPE_NUMERIC) {
				if (DateUtil.isCellDateFormatted(cell)) {
					date = cell.getDateCellValue();
				}
			} else if (cell.getCellType() == Cell.CELL_TYPE_STRING) {
				String strCell = cell.getStringCellValue();
				date = getMMDDYYYYHHMMSSADate(strCell);
				if (date == null) {
					date = getMMDDYYYYDate(strCell);
				}
			}

		}

		return date;
	}

	public static long getCellLongValue(Cell cell) {
		long cellLong = -1;
		if (cell != null && Cell.CELL_TYPE_NUMERIC == cell.getCellType()) {
			cellLong = (long) cell.getNumericCellValue();
		}

		return cellLong;
	}
}
