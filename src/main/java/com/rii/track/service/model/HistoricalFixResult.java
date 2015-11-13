package com.rii.track.service.model;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class HistoricalFixResult {

	private long id;

	private long issueID;

	private String partNum;

	private String versionFix;

	public long getId() {
		return id;
	}

	public long getIssueID() {
		return issueID;
	}

	public String getPartNum() {
		return partNum;
	}

	public String getVersionFix() {
		return versionFix;
	}

	public void setId(long id) {
		this.id = id;
	}

	public void setIssueID(long issueID) {
		this.issueID = issueID;
	}

	public void setPartNum(String partNum) {
		this.partNum = partNum;
	}

	public void setVersionFix(String versionFix) {
		this.versionFix = versionFix;
	}
}
