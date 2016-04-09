package com.rii.track.service;

import java.util.List;

import com.rii.track.service.model.IssueFilter;

public interface SearchService<T, S> {

	List<S> getSearch(String query);
	
	List<S> postSearch(IssueFilter filter);
}
