package com.rii.track.service.model;

import java.util.Comparator;

public class TodoResultWhoComparator implements Comparator<TodoResult> {

	@Override
	public int compare(TodoResult o1, TodoResult o2) {

		return ((o1.getWho() >= o2.getWho()) ? -1 : 1);
	}
}
