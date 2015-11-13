package com.rii.track.util;

public class PageUtil {
	public static int DEFAULT_PAGE = 1;
	public static int DEFAULT_ITEM_PER_PAGE = 10;

	public static long getItemPerPage(String itemPerPage) {
		long perPage = ConvertUtil.getLongId(itemPerPage);
		perPage = perPage < 0 ? DEFAULT_ITEM_PER_PAGE : perPage;

		return perPage;
	}

	public static long getOffset(String pageNo, String itemPerPage) {
		long pageNum = ConvertUtil.getLongId(pageNo);

		pageNum = pageNum < 0 ? DEFAULT_PAGE : pageNum;
		long offset = pageNum * getItemPerPage(itemPerPage);

		return offset;
	}
}