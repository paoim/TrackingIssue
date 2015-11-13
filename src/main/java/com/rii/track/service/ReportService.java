package com.rii.track.service;

import java.util.List;

import com.rii.track.service.model.IssueFilter;

public interface ReportService<T, S> {

	List<S> reportEntities(IssueFilter filter);
}
