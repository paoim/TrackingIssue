package com.rii.track.service.model;

public class TodoFilter {

	private String isDefault;

	private String partNum;

	private String who;

	private String when;

	private String status;

	private String startDate;

	private String endDate;

	public String getIsDefault() {
		return isDefault;
	}

	public void setIsDefault(String isDefault) {
		this.isDefault = isDefault;
	}

	public String getPartNum() {
		return partNum;
	}

	public void setPartNum(String partNum) {
		this.partNum = partNum;
	}

	public String getWho() {
		return who;
	}

	public void setWho(String who) {
		this.who = who;
	}

	public String getWhen() {
		return when;
	}

	public void setWhen(String when) {
		this.when = when;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	@Override
	public String toString() {
		return "isDefault:" + this.isDefault + "|partNum:" + this.partNum + "|when:" + this.when + "|who:" + this.who + "|status:" + this.status + "|startDate:" + this.startDate + "|endDate:" + this.endDate;
	}
}
