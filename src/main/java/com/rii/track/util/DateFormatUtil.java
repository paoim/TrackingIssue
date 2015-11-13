package com.rii.track.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateFormatUtil {

	private String dateFormat;
	
	public static final String SLAS_DDMMYY = "dd/MM/yy";
	public static final String DAS_DDMMYYYY = "dd-MM-yyyy";
	public static final String DAS_YYYYMMDD = "yyyy/MM/dd";
	public static final String SLAS_MMDDYYYY = "MM/dd/yyyy";
	public static final String DAS_DDMMYYHHMMSS = "dd-MM-yy:HH:mm:SS";
	public static final String DAS_DDMMYYHHMMSSZ = "dd-MM-yy:HH:mm:SS Z";
	public static final String SLAS_MMDDYYYYHHMMSSA = "MM/dd/yyyy:HH:mm:SS a";

	public DateFormatUtil(String dateFormat) {
		this.dateFormat = dateFormat;
	}

	public static Date todayDate() {
		return new Date();
	}

	public String formateToday() {
		SimpleDateFormat format = new SimpleDateFormat(dateFormat);
		return format.format(DateFormatUtil.todayDate());
	}

	public String doFormate(Date date) {
		SimpleDateFormat format = new SimpleDateFormat(dateFormat);
		return format.format(date);
	}

	public Date getDateFormat(String strDate) {
		Date date = null;
		SimpleDateFormat formatter = new SimpleDateFormat(dateFormat);

		try {
			date = formatter.parse(strDate);
		} catch (ParseException e) {
			date = null;
		}

		return date;
	}

	public static void main(String[] args) {
		// This is how to get today's date in Java
		Date today = new Date();

		// If you print Date, you will get un formatted output
		System.out.println("Today is : " + today);

		// formatting date in Java using SimpleDateFormat
		SimpleDateFormat DATE_FORMAT = new SimpleDateFormat(DAS_DDMMYYYY);
		String date = DATE_FORMAT.format(today);
		System.out.println("Today in dd-MM-yyyy format : " + date);

		DATE_FORMAT = new SimpleDateFormat(DAS_YYYYMMDD);
		date = DATE_FORMAT.format(today);
		System.out.println("Today in yyyy-MM-dd format : " + date);

		// Another Example of formatting Date in Java using SimpleDateFormat
		DATE_FORMAT = new SimpleDateFormat("dd/MM/yy");
		date = DATE_FORMAT.format(today);
		System.out.println("Today in dd/MM/yy pattern : " + date);

		// formatting Date with time information
		DATE_FORMAT = new SimpleDateFormat("dd-MM-yy:HH:mm:SS");
		date = DATE_FORMAT.format(today);
		System.out.println("Today in dd-MM-yy:HH:mm:SS : " + date);

		// SimpleDateFormat example - Date with timezone information
		DATE_FORMAT = new SimpleDateFormat("dd-MM-yy:HH:mm:SS Z");
		date = DATE_FORMAT.format(today);
		System.out.println("Today in dd-MM-yy:HH:mm:SSZ : " + date);

		// 5/27/2014 2:29:16 PM
		DATE_FORMAT = new SimpleDateFormat("MM/dd/yyyy:HH:mm:SS a");
		date = DATE_FORMAT.format(today);
		System.out.println("Today in MM/dd/yyyy:HH:mm:SSa : " + date);

		DateFormatUtil dateFormate = new DateFormatUtil(SLAS_MMDDYYYYHHMMSSA);
		String version = "[Version: " + dateFormate.formateToday() + "]";
		System.out.println(version);
	}
}
