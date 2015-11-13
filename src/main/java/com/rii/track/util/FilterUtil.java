package com.rii.track.util;

import com.rii.track.service.model.IssueFilter;
import com.rii.track.service.model.TodoFilter;

public class FilterUtil {

	public static String getIssueSearchQuery(IssueFilter filter) {
		String query = "", operator = "";

		if (filter.getPartNum() != null) {
			query = query + "partNum like '" + filter.getPartNum() + "%'";
			operator = " and ";
		}

		if (filter.getOpendBy() != null) {
			query = query + (operator.length() > 0 ? operator : "")
					+ "openedBy like '" + filter.getOpendBy() + "%'";
			operator = " and ";
		}

		if (filter.getAssignedTo() != null) {
			query = query + (operator.length() > 0 ? operator : "")
					+ "assignedTo like '" + filter.getAssignedTo() + "%'";
			operator = " and ";
		}

		if (filter.getStatus() != null) {
			query = query + (operator.length() > 0 ? operator : "")
					+ "status like '" + filter.getStatus() + "%'";
			operator = " and ";
		}

		if (filter.getCategory() != null) {
			query = query + (operator.length() > 0 ? operator : "")
					+ "category like '" + filter.getCategory() + "%'";
			operator = " and ";
		}

		if (filter.getPriority() != null) {
			query = query + (operator.length() > 0 ? operator : "")
					+ "priority like '" + filter.getPriority() + "%'";
			operator = " and ";
		}

		return query;
	}

	public static String getIssueReortQuery(IssueFilter filter) {
		String query = "";
		boolean isDefault = (Integer.parseInt(filter.getIsDefault()) == 1);

		if (isDefault) {
			query = "order by ISSUE_ID desc limit 100";
		} else {
			if (filter.getStartDate() != null && filter.getEndDate() != null) {
				query = query + "((openedDate >= '" + filter.getStartDate()
						+ "' and openedDate <= '" + filter.getEndDate()
						+ "') or (dueDate >= '" + filter.getStartDate()
						+ "' and dueDate <= '" + filter.getEndDate()
						+ "')) and ";
			}

			if (filter.getIssueId() != null) {
				query = query + "ISSUE_ID = " + filter.getIssueId() + " and ";
			}

			if (filter.getPartNum() != null) {
				query = query + "partNum = '" + filter.getPartNum() + "' and ";
			}

			if (filter.getOpendBy() != null) {
				query = query + "openedBy = " + filter.getOpendBy() + " and ";
			}

			if (filter.getAssignedTo() != null) {
				query = query + "assignedTo = " + filter.getAssignedTo()
						+ " and ";
			}

			if (filter.getStatus() != null) {
				query = query + "status = " + filter.getStatus();
			}

			if (query.length() > 0) {
				if (query.endsWith(" and ")) {
					query = query.substring(0,
							query.length() - " and ".length());
				}
			}
		}

		return query;
	}

	public static String getOpenTaskQuery() {
		String query = "isCompleted = 0";
		return query;
	}

	public static String getTodoCompleteQuery() {
		String query = "isCompleted = 1 and DATE(dueDate) = DATE(NOW())";
		return query;
	}

	public static String getTodoQuery(TodoFilter filter) {
		String query = "";
		boolean isDefault = (Integer.parseInt(filter.getIsDefault()) == 1);

		if (isDefault) {
			query = "isCompleted = 0 and DATE(dueDate) = DATE(NOW())";
		} else {
			if (filter.getStartDate() != null && filter.getEndDate() != null) {
				query = "(dueDate >= '" + filter.getStartDate()
						+ "' and dueDate <= '" + filter.getEndDate()
						+ "') and ";
			}

			if (filter.getWho() != null) {
				query = query + "who = " + filter.getWho() + " and ";
			}

			if (filter.getWhen() != null) {
				query = query + "dueDate = '" + filter.getWhen() + "' and ";
			}

			if (filter.getPartNum() != null) {
				query = query + "partNum = '" + filter.getPartNum() + "' and ";
			}

			if (filter.getStatus() != null) {
				query = query + "isCompleted = " + filter.getStatus();
			}

			if (query.length() > 0) {
				if (query.endsWith(" and ")) {
					query = query.substring(0,
							query.length() - " and ".length());
				}
			} else {
				query = "isCompleted = 0 and DATE(dueDate) = DATE(NOW())";
			}
		}

		return query;
	}
}
