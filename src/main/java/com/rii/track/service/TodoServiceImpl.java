package com.rii.track.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import com.rii.track.model.Contact;
import com.rii.track.model.Todo;
import com.rii.track.repository.CRUDRepository;
import com.rii.track.service.model.TodoFilter;
import com.rii.track.service.model.TodoResult;
import com.rii.track.service.model.TodoResultWhoComparator;
import com.rii.track.util.ConvertUtil;
import com.rii.track.util.DateFormatUtil;
import com.rii.track.util.EmailSMTPUtil;
import com.rii.track.util.EmailSchedulerUtil;
import com.rii.track.util.EntityUtil;
import com.rii.track.util.FilterUtil;
import com.rii.track.util.PageUtil;

@Service
public class TodoServiceImpl implements CRUDService<Todo, TodoResult>,
		TodoRelatedService<Todo, TodoResult> {

	private CRUDRepository<Todo> todoRepository;

	private CRUDRepository<Contact> contactRepository;

	@Override
	public TodoResult create(Todo entity) {
		todoRepository.create(entity);
		Todo todo = todoRepository.getLastRow();

		sendEmailForUpsertTask(todo, false);
		
		return getResult(todo);
	}

	@Override
	public TodoResult update(Todo entity) {
		todoRepository.update(entity);
		Todo todo = todoRepository.findOne(entity.getId());

		sendEmailForUpsertTask(todo, true);
		
		return getResult(todo);
	}

	@Override
	public void delete(Todo entity) {
		todoRepository.delete(entity);
	}

	@Override
	public void deleteById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		if (entityId != -1) {
			todoRepository.deleteById(entityId);
		}
	}

	@Override
	public TodoResult getLastRecord() {
		Todo todo = todoRepository.getLastRow();
		if (EntityUtil.isNullEntity(todo)) {
			todo = new Todo();
		}

		return getResult(todo);
	}

	@Override
	public TodoResult getById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		Todo todo = todoRepository.findOne(entityId);
		if (EntityUtil.isNullEntity(todo)) {
			todo = new Todo();
		}

		return getResult(todo);
	}

	@Override
	public List<TodoResult> getAll(String sortDesc) {
		boolean isDesc = Boolean.parseBoolean(sortDesc);
		List<Todo> todolist = todoRepository.findAll(isDesc);
		if (EntityUtil.isEmpltyList(todolist)) {
			todolist = new ArrayList<Todo>();
		}

		return getResults(todolist);
	}

	@Override
	public List<TodoResult> getEntitiesByPageNo(String pageNo,
			String itemPerPage) {
		long perPage = PageUtil.getItemPerPage(itemPerPage);
		long pageNum = PageUtil.getOffset(pageNo, itemPerPage);
		List<Todo> todolist = todoRepository.findByPage(pageNum, perPage);
		if (EntityUtil.isEmpltyList(todolist)) {
			todolist = new ArrayList<Todo>();
		}

		return getResults(todolist);
	}

	@Override
	public List<TodoResult> reportEntities(TodoFilter filter) {
		String query = FilterUtil.getTodoQuery(filter);
		List<Todo> todolist = todoRepository.getEntities(query);
		if (EntityUtil.isEmpltyList(todolist)) {
			todolist = new ArrayList<Todo>();
		}

		return getResults(todolist);
	}

	@Override
	public List<TodoResult> getPartNumList(String partNum) {
		String query = "PartNum like '" + partNum + "%'";
		List<Todo> todolist = todoRepository.getEntities(query);
		if (EntityUtil.isEmpltyList(todolist)) {
			todolist = new ArrayList<Todo>();
		}

		return getPartNumResults(todolist);
	}

	@Override
	public void sendMailTLS() {
		EmailSchedulerUtil email = getEmailTest();
		email.sendMailTLS();
	}

	@Override
	public void sendMailSSL() {
		EmailSchedulerUtil email = getEmailTest();
		email.sendMailSSL();
	}

	@Override
	public void sendAllOpenTasksToSupervisor() {
		System.out.println("============Start >> sendAllOpenTasksToSupervisor===========================================");
		EmailSMTPUtil email = new EmailSMTPUtil();
		List<TodoResult> results = getOpenTaskList();

		email.setSendTo("Drozelle@rubberindustries.com,noreplyriitrackingissue@gmail.com");
		email.setSubject("List of all Open Tasks");
		email.setBody(getHtml(results));

		EmailSchedulerUtil emailScheduler = new EmailSchedulerUtil(email);
		emailScheduler.sendMailTLSEveryDayAtSixAm();
		System.out.println("============End >> sendAllOpenTasksToSupervisor===========================================");
	}

	@Override
	public void sendOpenTasksToEveryOne() {
		System.out.println("============Start >> sendOpenTasksToEveryOne===========================================");
		List<EmailSchedulerUtil> emailSchedulers = getEmailSchedulers();
		for(EmailSchedulerUtil email : emailSchedulers) {
			email.sendMailSSLEveryDayAtSixAm();
		}
		System.out.println("============End >> sendOpenTasksToEveryOne===========================================");
	}

	@Override
	public void pushToSendOpenTasksToEveryOne() {
		System.out.println("============Start >> pushToSendOpenTasksToEveryOne===========================================");
		List<EmailSchedulerUtil> emailSchedulers = getEmailSchedulers();
		for(EmailSchedulerUtil email : emailSchedulers) {
			email.sendMailTLS();
		}
		System.out.println("============End >> pushToSendOpenTasksToEveryOne===========================================");
	}

	@Override
	public void pushToSendAllOpenTasksToSupervisor() {
		System.out.println("============Start >> pushToSendAllOpenTasksToSupervisor===========================================");
		EmailSMTPUtil email = new EmailSMTPUtil();
		List<TodoResult> results = getOpenTaskList();

		email.setSendTo("Drozelle@rubberindustries.com,noreplyriitrackingissue@gmail.com");
		email.setSubject("List of all Open Tasks");
		email.setBody(getHtml(results));

		EmailSchedulerUtil emailScheduler = new EmailSchedulerUtil(email);
		emailScheduler.sendMailSSL();
		System.out.println("============End >> pushToSendAllOpenTasksToSupervisor===========================================");
	}

	@Override
	public List<EmailSMTPUtil> getOpenTasksForEveryOne() {
		System.out.println("============Start >> getOpenTasksForEveryOne===========================================");
		List<EmailSMTPUtil> emailList = new ArrayList<EmailSMTPUtil>();
		List<EmailSchedulerUtil> emailSchedulers = getEmailSchedulers();
		
		for(EmailSchedulerUtil email : emailSchedulers) {
			emailList.add(email.getEmail());
		}
		System.out.println("============End >> getOpenTasksForEveryOne===========================================");
		
		return emailList;
	}

	protected List<EmailSchedulerUtil> getEmailSchedulers() {
		System.out.println("============Start >> getEmailSchedulers===========================================");
		List<TodoResult> results = getOpenTaskList();
		Map<Long, String> email = new HashMap<Long, String>();
		List<TodoResult> otherEmails = new ArrayList<TodoResult>();
		List<EmailSchedulerUtil> emailSchedulers = new ArrayList<EmailSchedulerUtil>();
		Map<Long, List<TodoResult>> mapForEmail = new HashMap<Long, List<TodoResult>>();

		// Group all users by user ID and email
		for (TodoResult result : results) {
			long key = result.getWho();
			if (EntityUtil.isValidString(result.getEmail())) {// only exist or valid email
				if (mapForEmail.get(key) == null) {
					mapForEmail.put(key, new ArrayList<TodoResult>());
				}
				email.put(key, result.getEmail());
				mapForEmail.get(key).add(result);
			} else {
				otherEmails.add(result);
			}
		}

		// Group by Users with their email
		for (long key : mapForEmail.keySet()) {
			EmailSMTPUtil emailUtil = new EmailSMTPUtil();
			emailUtil.setSendTo(email.get(key) + ",Drozelle@rubberindustries.com,noreplyriitrackingissue@gmail.com");
			emailUtil.setSubject("List of all your Open Tasks");
			String html = getHtml(mapForEmail.get(key));
			emailUtil.setBody(html);
			emailSchedulers.add(new EmailSchedulerUtil(emailUtil));
		}
		
		// Group by Users without their email
		if (otherEmails.size() > 0) {
			EmailSMTPUtil emailUtil = new EmailSMTPUtil();
			emailUtil.setSendTo("Drozelle@rubberindustries.com,noreplyriitrackingissue@gmail.com");
			emailUtil.setSubject("List of all Open Tasks without their email");
			String html = getHtml(otherEmails);
			emailUtil.setBody(html);
			emailSchedulers.add(new EmailSchedulerUtil(emailUtil));
		}
		
		System.out.println("============End >> getEmailSchedulers===========================================");

		return emailSchedulers;
	}
	
	private void sendEmailForUpsertTask(Todo todo, boolean isUpdate) {
		System.out.println("============Start >> sendEmailForUpsertTask===========================================");
		String htmlText = getHeader();
		TodoResult result = getOpenTask(todo);
		EmailSMTPUtil email = new EmailSMTPUtil();
		String subjectPart = "created New Task with ID: " + todo.getId();
		String style = "style='background: #fff;border-top: 1px solid #ddddff;'";
		
		if (isUpdate) {
			subjectPart = "updated existing Task with ID: " + todo.getId();
		}
		
		if (EntityUtil.isValidString(result.getEmail())) {// only exist or valid email
			email.setSendTo(result.getEmail() + ",noreplyriitrackingissue@gmail.com");
			email.setSubject("You have " + subjectPart);
		} else {
			String subject = "Someone has ";
			if (EntityUtil.isValidString(result.getContact())) {
				subject = result.getContact() + " has ";
			}
			subject = subject + subjectPart;
			email.setSendTo("Drozelle@rubberindustries.com,noreplyriitrackingissue@gmail.com");
			email.setSubject(subject);
		}
		
		htmlText += getBody(result, style);
		htmlText += "</table>";
		email.setBody(htmlText);
		
		EmailSchedulerUtil emailScheduler = new EmailSchedulerUtil(email);
		emailScheduler.sendMailSSL();
		System.out.println("============End >> sendEmailForUpsertTask===========================================");
	}

	protected EmailSchedulerUtil getEmailTest() {
		EmailSMTPUtil email = new EmailSMTPUtil();
		List<TodoResult> results = getOpenTaskList();
		email.setSendTo("noreplyriitrackingissue@gmail.com");
		email.setSubject("Here are all of your open tasks");
		String html = "<i>Greetings!</i><br>";
		html += "<b>Wish you a nice day!</b><br>";
		html += "<font color=red>Your total open tasks is </font>" + +results.size() + ".";
		email.setBody(html);
		EmailSchedulerUtil emailScheduler = new EmailSchedulerUtil(email);
		return emailScheduler;
	}

	private String getHtml(List<TodoResult> results) {
		int index = 0;
		String htmlText = getHeader();

		for (TodoResult result : results) {
			String style = "style='background: #ddddff;border-top: 1px solid #fff;'";
			if ((index % 2) == 0) {
				style = "style='background: #fff;border-top: 1px solid #ddddff;'";
			}
			htmlText += getBody(result, style);
			index++;
		}
		htmlText += "</table>";
		return htmlText;
	}
	
	private String getHeader() {
		String htmlText = "<table style='border-collapse: collapse;border: 1px solid #fff;'>";
		htmlText += "<tr style='background: #d9edf7;;border-top: 1px solid #ddddff;'>";
		htmlText += "<th>Task#</th>";
		htmlText += "<th>Who</th>";
		htmlText += "<th>When</th>";
		htmlText += "<th>What</th>";
		htmlText += "<th>Part#</th>";
		htmlText += "</tr>";
		return htmlText;
	}
	
	private String getBody(TodoResult result, String style) {
		String htmlText = "<tr " + style + ">";
		htmlText += "<td>" + result.getId() + "</td>";
		htmlText += "<td>" + result.getContact() + "</td>";
		htmlText += "<td>" + result.getWhen() + "</td>";
		htmlText += "<td>" + HtmlUtils.htmlEscape(result.getWhat()) + "</td>";
		htmlText += "<td>" + result.getPartNum() + "</td>";
		htmlText += "</tr>";
		return htmlText;
	}

	private List<TodoResult> getOpenTaskList() {
		String query = FilterUtil.getOpenTaskQuery();
		List<TodoResult> results = new ArrayList<TodoResult>();
		List<Todo> todolist = todoRepository.getEntities(query);
		for (Todo todo : todolist) {
			if (todo.getWho() != -1) {
				TodoResult result = getOpenTask(todo);
				results.add(result);
			}
		}
		
		// Sort all TodoResults by Who (ContactID)
		Collections.sort(results, new TodoResultWhoComparator());
		
		return results;
	}
	
	private TodoResult getOpenTask(Todo todo) {
		TodoResult result = new TodoResult();
		DateFormatUtil dformat = new DateFormatUtil(DateFormatUtil.SLAS_MMDDYYYY);
		if (todo.getWho() != -1) {
			result.setId(todo.getId());
			result.setWho(todo.getWho());
			
			Contact contact = contactRepository.findOne(todo.getWho());
			if (contact != null) {
				String contactName = contact.getFirstName();
				contactName = EntityUtil.isValidString(contactName) ? contactName
						.concat(" " + contact.getLastName()) : contact
						.getLastName();
				result.setContact(contactName);
				result.setEmail(contact.getEmailAddress());
			}
			
			result.setWhen(dformat.doFormate(todo.getDueDate()));
			result.setDueDate(todo.getDueDate());
			result.setWhat(todo.getWhat());
			result.setPartNum(todo.getPartNumber());
			result.setIssueID(todo.getIssueID());
		}
		
		return result;
	}

	private List<TodoResult> getPartNumResults(List<Todo> todolist) {
		List<TodoResult> results = new ArrayList<TodoResult>();
		for (Todo todo : todolist) {
			TodoResult result = getPartNumResult(todo);
			results.add(result);
		}

		return results;
	}

	private List<TodoResult> getResults(List<Todo> todolist) {
		List<TodoResult> results = new ArrayList<TodoResult>();
		for (Todo todo : todolist) {
			TodoResult result = getResult(todo);
			results.add(result);
		}
		
		// Sort all TodoResults by Who (ContactID)
		Collections.sort(results, new TodoResultWhoComparator());

		return results;
	}

	private TodoResult getPartNumResult(Todo todo) {
		TodoResult result = new TodoResult();
		result.setId(todo.getId());
		result.setPartNum(todo.getPartNumber());

		return result;
	}

	private TodoResult getResult(Todo todo) {
		Contact contact = contactRepository.findOne(todo.getWho());
		TodoResult result = ConvertUtil.todoConverter(todo, contact);

		return result;
	}

	@Override
	public void saveDafult() {

	}

	@Override
	public String getQuery(Todo entity) {

		return null;
	}

	@Override
	public void uploadExcelContent(InputStream is, String fileName) {

	}

	public void setContactRepository(CRUDRepository<Contact> contactRepository) {
		this.contactRepository = contactRepository;
	}

	public void setTodoRepository(CRUDRepository<Todo> todoRepository) {
		this.todoRepository = todoRepository;
	}
}
