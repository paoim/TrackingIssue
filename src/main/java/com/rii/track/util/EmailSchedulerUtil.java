package com.rii.track.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

public class EmailSchedulerUtil {

	private String hour;
	
	private EmailSMTPUtil email;
	
	final public static String SIX_AM = "06:10 AM";

	public EmailSchedulerUtil(EmailSMTPUtil email, String hour) {
		this.hour = hour;
		this.email = email;
	}

	public EmailSMTPUtil getEmail() {
		return email;
	}

	public void sendMailTLS() {
		email.sendMailTLS();
		System.out.println("Task is running on: " + new Date());
	}

	public void sendMailSSL() {
		email.sendMailSSL();
		System.out.println("Task is running on: " + new Date());
	}

	public void sendMailTLSEveryDay() {
		System.out.println("============Start >> sendMailTLSEveryDayAtSixAm===========================================");
		Timer timer = new Timer();
		Calendar date = getDate(this.hour); //"06:10 AM"
		System.out.println("Start to generate on: " + date.getTime());

		// Schedule to run every day
		timer.scheduleAtFixedRate(new TimerTask() {
			@Override
			public void run() {
				Date now = new Date();
				Date dateToBackup = null;
				SimpleDateFormat sdf = new SimpleDateFormat("MMMM-dd-yyyy hh:mm aaa");
				try {
					dateToBackup = sdf.parse(sdf.format(now));
				} catch (ParseException e) {
					e.printStackTrace();
				}

				Calendar calendar = Calendar.getInstance();
				calendar.setTime(dateToBackup);

				System.out.println("Sending on: " + sdf.format(now));
				System.out.println("Number of Hour: " + calendar.get(Calendar.HOUR));

				// Make sure it is in Morning at 6 AM
				//if (calendar.get(Calendar.AM_PM) == 0) {
					//if (calendar.get(Calendar.HOUR) == 6) {
						sendMailTLS();
					//}
				//}
			}
		}, date.getTime(), 1000 * 60 * 60 * 24);
		System.out.println("============End >> sendMailTLSEveryDayAtSixAm===========================================");
	}

	public void sendMailSSLEveryDay() {
		System.out.println("============Start >> sendMailSSLEveryDayAtSixAm===========================================");
		Timer timer = new Timer();
		Calendar date = getDate(this.hour); //"06:10 AM"
		System.out.println("Start to generate on: " + date.getTime());

		// Schedule to run every day
		timer.scheduleAtFixedRate(new TimerTask() {
			@Override
			public void run() {
				Date now = new Date();
				Date dateToBackup = null;
				SimpleDateFormat sdf = new SimpleDateFormat("MMMM-dd-yyyy hh:mm aaa");
				try {
					dateToBackup = sdf.parse(sdf.format(now));
				} catch (ParseException e) {
					e.printStackTrace();
				}

				Calendar calendar = Calendar.getInstance();
				calendar.setTime(dateToBackup);

				System.out.println("Sending on: " + sdf.format(now));
				System.out.println("Number of Hour: " + calendar.get(Calendar.HOUR));

				// Make sure it is in Morning at 6 AM
				//if (calendar.get(Calendar.AM_PM) == 0) {
					//if (calendar.get(Calendar.HOUR) == 6) {
						sendMailSSL();
					//}
				//}
			}
		}, date.getTime(), 1000 * 60 * 60 * 24);
		System.out.println("============End >> sendMailSSLEveryDayAtSixAm===========================================");
	}

	private Calendar getDate(String timeFilter) {
		Date now = new Date();
		Date dateToBackup = null;
		Calendar date = Calendar.getInstance();
		SimpleDateFormat sdfNow = new SimpleDateFormat("MMMM-dd-yyyy");
		SimpleDateFormat sdf = new SimpleDateFormat("MMMM-dd-yyyy hh:mm aaa");

		String atSixAm = sdfNow.format(now) + " " + timeFilter;
		try {
			dateToBackup = sdf.parse(atSixAm);
		} catch (ParseException e) {
			e.printStackTrace();
		}

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(dateToBackup);

		date.set(Calendar.HOUR, calendar.get(Calendar.HOUR));
		date.set(Calendar.MINUTE, calendar.get(Calendar.MINUTE));
		date.set(Calendar.SECOND, calendar.get(Calendar.SECOND));
		date.set(Calendar.MILLISECOND, 0);

		return date;
	}
}
