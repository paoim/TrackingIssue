package com.rii.track.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "historical_fix")
@XmlRootElement
public class HistoricalFix extends MetaData {

	// [Version: 5/27/2014 2:29:16 PM] Just for Test comment

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "FIX_ID")
	@GeneratedValue
	private long id;

	@Column(name = "ISSUE_ID")
	private long issueID;

	@Column(name = "partNum")
	@XmlElement(name = "partNum")
	private String partNumber;

	@Column(name = "versionFix", columnDefinition = "TEXT")
	private String versionFix;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getIssueID() {
		return issueID;
	}

	public void setIssueID(long issueID) {
		this.issueID = issueID;
	}

	public String getPartNumber() {
		return partNumber;
	}

	public void setPartNumber(String partNumber) {
		this.partNumber = partNumber;
	}

	public String getVersionFix() {
		return versionFix;
	}

	public void setVersionFix(String versionFix) {
		this.versionFix = versionFix;
	}
}
