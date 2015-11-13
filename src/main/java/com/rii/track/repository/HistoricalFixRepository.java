package com.rii.track.repository;

import java.util.List;

import com.rii.track.model.HistoricalFix;

public interface HistoricalFixRepository extends CRUDRepository<HistoricalFix> {

	List<HistoricalFix> getHistoricalFixes(long issueId, String partNumber);

	void updateSql(String query);

	void deleteSql(long entityId);
}
