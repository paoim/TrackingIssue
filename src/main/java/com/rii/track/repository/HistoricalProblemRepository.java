package com.rii.track.repository;

import java.util.List;

import com.rii.track.model.HistoricalProblem;

public interface HistoricalProblemRepository extends
		CRUDRepository<HistoricalProblem> {

	List<HistoricalProblem> getHistoricalProblems(long issueId,
			String partNumber);

	void updateSql(String query);

	void deleteSql(long entityId);
}
