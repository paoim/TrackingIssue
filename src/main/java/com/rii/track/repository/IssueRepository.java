package com.rii.track.repository;

import java.util.List;

import com.rii.track.model.Issue;

public interface IssueRepository extends CRUDRepository<Issue> {

	List<Issue> getOpenedByList(long contactId);

	List<Issue> getAssignedToList(long contactId);
}
