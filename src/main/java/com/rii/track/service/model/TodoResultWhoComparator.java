package com.rii.track.service.model;

import java.util.Comparator;

public class TodoResultWhoComparator implements Comparator<TodoResult> {

	@Override
	public int compare(TodoResult o1, TodoResult o2) {
		return new Double(o1.getWho()).compareTo(new Double(o2.getWho()));
	}
}
