package com.rii.track.service;

import java.util.List;

import com.rii.track.model.HistoricalFix;
import com.rii.track.service.model.HistoricalFixResult;

public interface HistoricalFixService extends
		CRUDService<HistoricalFix, HistoricalFixResult>,
		ReportService<HistoricalFix, HistoricalFixResult> {

	List<HistoricalFixResult> getIssueList(String issueID);

	List<HistoricalFixResult> getPartNumList(String partNum);
}
