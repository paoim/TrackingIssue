package com.rii.track.service.model;

public class HourFilter {

	private String hour;
	
	private String minute;
	
	private String part;

	public String getHour() {
		return hour;
	}

	public void setHour(String hour) {
		this.hour = hour;
	}

	public String getMinute() {
		return minute;
	}

	public void setMinute(String minute) {
		this.minute = minute;
	}

	public String getPart() {
		return part;
	}

	public void setPart(String part) {
		this.part = part;
	}
	
	public String toString() {
		return this.hour + ':' + this.minute + ' ' + this.part;
	}
}
