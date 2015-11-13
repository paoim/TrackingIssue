package com.rii.track.service;

import java.util.List;

import com.rii.track.service.model.IssueFilter;

public interface SearchService<T, S> {

	List<S> search(IssueFilter filter);
}
