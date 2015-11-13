package com.rii.track.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "issue")
@XmlRootElement
public class Issue extends MetaData {
	private static final long serialVersionUID = 1L;

	@Column(name = "assignedTo")
	// Contact ID
	private long assignedTo;

	@Column(name = "attachment")
	// Photo ID
	private long attachment;

	@Column(name = "category")
	// Category ID
	private long category;

	@Column(name = "custName")
	@XmlElement(name = "custName")
	private String customterName;

	@Column(name = "dueDate")
	private Date dueDate;

	@Column(name = "fix", columnDefinition = "TEXT")
	// description
	private String fix;

	@Column(name = "followUntil")
	private Date followUntil;

	@Column(name = "formulaNum")
	@XmlElement(name = "formulaNum")
	private String formulaNumber;

	@Id
	@Column(name = "ISSUE_ID")
	@GeneratedValue
	private long id;

	@Column(name = "ID_FROM_EXCEL")
	private long issueIdFromExcel;

	@Column(name = "jobNum")
	@XmlElement(name = "jobNum")
	private String jobNumber;

	@Column(name = "moldNum")
	@XmlElement(name = "moldNum")
	private String moldNumber;

	@Column(name = "openedBy")
	// Contact ID
	private long openedBy;

	@Column(name = "openedDate")
	private Date openedDate;

	@Column(name = "partNum")
	@XmlElement(name = "partNum")
	private String partNumber;

	@Column(name = "pressNum")
	@XmlElement(name = "pressNum")
	private String pressNumber;

	@Column(name = "priority")
	// Priority ID
	private long priority;

	@Column(name = "problem", columnDefinition = "TEXT")
	// comments
	private String problem;

	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "relatedIssue_id")
	private Issue relatedIssue;

	@Column(name = "relatedIssue_IDs")
	private String relatedIssueIds;

	@OneToMany(fetch = FetchType.EAGER, mappedBy = "relatedIssue", cascade = CascadeType.ALL)
	private List<Issue> relatedIssues;

	@Column(name = "status")
	// Status ID
	private long status;

	public long getAssignedTo() {
		return assignedTo;
	}

	public long getAttachment() {
		return attachment;
	}

	public long getCategory() {
		return category;
	}

	public String getCustomterName() {
		return customterName;
	}

	public Date getDueDate() {
		return dueDate;
	}

	public String getFix() {
		return fix;
	}

	public Date getFollowUntil() {
		return followUntil;
	}

	public String getFormulaNumber() {
		return formulaNumber;
	}

	public long getId() {
		return id;
	}

	public long getIssueIdFromExcel() {
		return issueIdFromExcel;
	}

	public String getJobNumber() {
		return jobNumber;
	}

	public String getMoldNumber() {
		return moldNumber;
	}

	public long getOpenedBy() {
		return openedBy;
	}

	public Date getOpenedDate() {
		return openedDate;
	}

	public String getPartNumber() {
		return partNumber;
	}

	public String getPressNumber() {
		return pressNumber;
	}

	public long getPriority() {
		return priority;
	}

	public String getProblem() {
		return problem;
	}

	public Issue getRelatedIssue() {
		return relatedIssue;
	}

	public String getRelatedIssueIds() {
		return relatedIssueIds;
	}

	public List<Issue> getRelatedIssues() {
		if (relatedIssues == null) {
			relatedIssues = new ArrayList<Issue>();
		}

		return relatedIssues;
	}

	public long getStatus() {
		return status;
	}

	public void setAssignedTo(long assignedTo) {
		this.assignedTo = assignedTo;
	}

	public void setAttachment(long attachment) {
		this.attachment = attachment;
	}

	public void setCategory(long category) {
		this.category = category;
	}

	public void setCustomterName(String customterName) {
		this.customterName = customterName;
	}

	public void setDueDate(Date dueDate) {
		this.dueDate = dueDate;
	}

	public void setFix(String fix) {
		this.fix = fix;
	}

	public void setFollowUntil(Date followUntil) {
		this.followUntil = followUntil;
	}

	public void setFormulaNumber(String formulaNumber) {
		this.formulaNumber = formulaNumber;
	}

	public void setId(long id) {
		this.id = id;
	}

	public void setIssueIdFromExcel(long issueIdFromExcel) {
		this.issueIdFromExcel = issueIdFromExcel;
	}

	public void setJobNumber(String jobNumber) {
		this.jobNumber = jobNumber;
	}

	public void setMoldNumber(String moldNumber) {
		this.moldNumber = moldNumber;
	}

	public void setOpenedBy(long openedBy) {
		this.openedBy = openedBy;
	}

	public void setOpenedDate(Date openedDate) {
		this.openedDate = openedDate;
	}

	public void setPartNumber(String partNumber) {
		this.partNumber = partNumber;
	}

	public void setPressNumber(String pressNumber) {
		this.pressNumber = pressNumber;
	}

	public void setPriority(long priority) {
		this.priority = priority;
	}

	public void setProblem(String problem) {
		this.problem = problem;
	}

	public void setRelatedIssue(Issue relatedIssue) {
		this.relatedIssue = relatedIssue;
	}

	public void setRelatedIssueIds(String relatedIssueIds) {
		this.relatedIssueIds = relatedIssueIds;
	}

	public void setRelatedIssues(List<Issue> relatedIssues) {
		this.relatedIssues = relatedIssues;
	}

	public void setStatus(long status) {
		this.status = status;
	}
}
