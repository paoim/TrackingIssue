package com.rii.track.service;

import java.util.List;

public interface IssueRelatedService<T, S> extends SearchService<T, S>,
		ReportService<T, S> {

	void updateHistoricalFix();

	void updateHistoricalProblem();

	S getPartNumById(String id);

	S getBriefIssueById(String id);

	List<S> getPartNumList(String partNum);

	List<S> getOpenedByList(String contactId);

	List<S> getAssignedToList(String contactId);
}
