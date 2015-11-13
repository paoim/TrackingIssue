package com.rii.track.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "todo")
@XmlRootElement
public class Todo extends MetaData {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "TODO_ID")
	@GeneratedValue
	private long id;

	@Column(name = "who")
	// contact ID
	private long who;

	@Column(name = "what", columnDefinition = "TEXT")
	private String what;

	@Column(name = "isCompleted", columnDefinition = "TINYINT(1)")
	private int isCompleted;

	@Column(name = "dueDate")
	private Date dueDate;

	@Column(name = "ISSUE_ID")
	private long issueID;

	@Column(name = "partNum")
	@XmlElement(name = "partNum")
	private String partNumber;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getWho() {
		return who;
	}

	public void setWho(long who) {
		this.who = who;
	}

	public String getWhat() {
		return what;
	}

	public void setWhat(String what) {
		this.what = what;
	}

	public int getIsCompleted() {
		return isCompleted;
	}

	public void setIsCompleted(int isCompleted) {
		this.isCompleted = isCompleted;
	}

	public Date getDueDate() {
		return dueDate;
	}

	public void setDueDate(Date dueDate) {
		this.dueDate = dueDate;
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
}
