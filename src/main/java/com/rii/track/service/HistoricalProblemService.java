package com.rii.track.service;

import java.util.List;

import com.rii.track.model.HistoricalProblem;
import com.rii.track.service.model.HistoricalProblemResult;

public interface HistoricalProblemService extends
		CRUDService<HistoricalProblem, HistoricalProblemResult>,
		ReportService<HistoricalProblem, HistoricalProblemResult> {

	void updatePartNum();

	List<HistoricalProblemResult> getIssueList(String issueID);

	List<HistoricalProblemResult> getPartNumList(String partNum);
}
