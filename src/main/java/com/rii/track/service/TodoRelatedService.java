package com.rii.track.service;

import java.util.List;

import com.rii.track.service.model.TodoFilter;
import com.rii.track.util.EmailSMTPUtil;

public interface TodoRelatedService<T, S> {

	List<S> reportEntities(TodoFilter filter);

	List<S> getPartNumList(String partNum);

	void sendMailTLS();

	void sendMailSSL();
	
	void pushToSendOpenTasksToEveryOne();
	
	void pushToSendAllOpenTasksToSupervisor();
	
	void sendOpenTasksToEveryOne(String hour);
	
	List<EmailSMTPUtil> getOpenTasksForEveryOne();
	
	void sendAllOpenTasksToSupervisor(String hour);
}
