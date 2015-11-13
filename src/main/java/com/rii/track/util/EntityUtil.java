package com.rii.track.util;

import java.util.List;

public class EntityUtil {

	public static <T> boolean isEmpltyList(List<T> entities) {

		return (entities.isEmpty() || entities.size() == 0);
	}

	public static <T> boolean isValidList(List<T> entities) {

		return !isEmpltyList(entities);
	}

	public static <T> boolean isNullEntity(T entity) {

		return entity == null;
	}

	public static <T> boolean isNotNullEntity(T entity) {

		return entity != null;
	}

	public static boolean isValidString(String str) {

		return (str != null && str.length() > 0);
	}

	public static boolean isValidHistory(String oldStr, String newStr,
			long newId, long newIdEx, long oldId, long oldIdEx) {
		boolean isValidOldHistory = (isValidString(oldStr)
				&& (!(oldStr.equalsIgnoreCase(newStr))) && (newId > 0 || newIdEx > 0));
		boolean isValidNewHistory = ((oldId > 0 || oldIdEx > 0)
				&& (isValidString(newStr)) && (!isValidString(oldStr)));

		return (isValidOldHistory || isValidNewHistory);
	}

	public static String makeString(String str) {
		return "'" + str + "'";
	}
}