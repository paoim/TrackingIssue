package com.rii.track.util;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class EmailSMTPUtil {

	private String username;

	private String password;

	private String sendTo;

	private String sendFrom;

	private String subject;

	private String body;

	public EmailSMTPUtil() {
		// Default Setting
		this.username = "noreplyriitrackingissue@gmail.com";
		this.password = "riitrackingissue";
		this.sendFrom = "noreplyriitrackingissue@gmail.com";
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setSendTo(String sendTo) {
		this.sendTo = sendTo;
	}

	public void setSendFrom(String sendFrom) {
		this.sendFrom = sendFrom;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public void setBody(String body) {
		this.body = body;
	}

	public String getSendTo() {
		return sendTo;
	}

	public String getSendFrom() {
		return sendFrom;
	}

	public String getSubject() {
		return subject;
	}

	public String getBody() {
		return body;
	}

	public void sendMailTLS() {
		System.out.println("====================Start >> sendMailTLS........=====================================");
		long start = System.currentTimeMillis();
		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587"); // 587
		System.out.println("====================>> Properties Configure successfully........");

		Session session = Session.getInstance(props,
		new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});
		System.out.println("====================>> Session Configure successfully........");

		try {
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(sendFrom));
			message.setRecipients(Message.RecipientType.TO,
					InternetAddress.parse(sendTo));
			message.setSubject(subject);
			// message.setText(body);
			message.setContent(body, "text/html; charset=utf-8");
			System.out.println("====================>> Message Configure successfully to send........");

			System.out.println("====================>> Start to send........");
			Transport.send(message);
			long end = System.currentTimeMillis();
			System.out.println("====================>> Send successfully......");
			System.out.println("====================>> Took : " + ((end - start) / 1000));

		} catch (MessagingException e) {
			throw new RuntimeException(e);
		}
		System.out.println("====================End >> sendMailTLS........=====================================");
	}

	public void sendMailSSL() {
		System.out.println("====================Start >> sendMailSSL........=====================================");
		long start = System.currentTimeMillis();
		Properties props = new Properties();
		props.put("mail.smtp.ssl.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.socketFactory.port", "465");
		props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.port", "465");
		System.out.println("====================>> Properties Configure successfully........");

		Session session = Session.getDefaultInstance(props,
		new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});
		System.out.println("====================>> Session Configure successfully........");

		try {
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(sendFrom));
			message.setRecipients(Message.RecipientType.TO,
					InternetAddress.parse(sendTo));
			message.setSubject(subject);
			// message.setText(body);
			message.setContent(body, "text/html; charset=utf-8");
			System.out.println("====================>> Message Configure successfully to send........");

			System.out.println("====================>> Start to send........");
			Transport.send(message);
			long end = System.currentTimeMillis();
			System.out.println("====================>> Send successfully......");
			System.out.println("====================>> Took : " + ((end - start) / 1000));

		} catch (MessagingException e) {
			throw new RuntimeException(e);
		}
		System.out.println("====================End >> sendMailSSL........=====================================");
	}
}
