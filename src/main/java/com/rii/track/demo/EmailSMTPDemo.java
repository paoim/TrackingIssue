package com.rii.track.demo;

import com.rii.track.util.EmailSMTPUtil;

public class EmailSMTPDemo {

	public static void main(String args[]) {
		sendMailTLS();
		// sendMailSSL();
	}

	protected static void sendMailTLS() {
		EmailSMTPUtil sendEmail = new EmailSMTPUtil();
		sendEmail.setSendTo("noreplyriitrackingissue@gmail.com");
		sendEmail.setSubject("Testing Email sending....");
		sendEmail
				.setBody("Hi, \n\n this is testing email. \n No spam to my email, please!");
		sendEmail.sendMailTLS();
	}

	protected static void sendMailSSL() {
		EmailSMTPUtil sendEmail = new EmailSMTPUtil();
		sendEmail.setSendTo("noreplyriitrackingissue@gmail.com");
		sendEmail.setSubject("Testing Email sending....");
		sendEmail
				.setBody("Hi, \n\n this is testing email. \n No spam to my email, please!");
		sendEmail.sendMailSSL();
	}

}
