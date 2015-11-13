package com.rii.track.service.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class IssueResult {

	private ContactResult assignedTo;

	private long attachment;

	private CategoryResult category;

	@XmlElement(name = "custName")
	private String customterName;

	private Date dueDate;

	private String fix; // description

	private Date followUntil;

	@XmlElement(name = "formulaNum")
	private String formulaNumber;

	private List<HistoricalFixResult> historicalFixes;

	private List<HistoricalProblemResult> historicalProblems;

	private long id;

	@XmlElement(name = "jobNum")
	private String jobNumber;

	@XmlElement(name = "moldNum")
	private String moldNumber;

	private ContactResult openedBy;

	private Date openedDate;

	@XmlElement(name = "partNum")
	private String partNumber;

	@XmlElement(name = "pressNum")
	private String pressNumber;

	private PriorityResult priority;

	private String problem; // comments

	private String relatedIssueIds;

	private List<Long> relatedIssueIdsList;

	private List<IssueResult> relatedIssues;

	private StatusResult status;

	public ContactResult getAssignedTo() {
		return assignedTo;
	}

	public long getAttachment() {
		return attachment;
	}

	public CategoryResult getCategory() {
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

	public List<HistoricalFixResult> getHistoricalFixes() {
		if (historicalFixes == null) {
			historicalFixes = new ArrayList<HistoricalFixResult>();
		}

		return historicalFixes;
	}

	public List<HistoricalProblemResult> getHistoricalProblems() {
		if (historicalProblems == null) {
			historicalProblems = new ArrayList<HistoricalProblemResult>();
		}

		return historicalProblems;
	}

	public long getId() {
		return id;
	}

	public String getJobNumber() {
		return jobNumber;
	}

	public String getMoldNumber() {
		return moldNumber;
	}

	public ContactResult getOpenedBy() {
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

	public PriorityResult getPriority() {
		return priority;
	}

	public String getProblem() {
		return problem;
	}

	public String getRelatedIssueIds() {
		return relatedIssueIds;
	}

	public List<Long> getRelatedIssueIdsList() {
		if (relatedIssueIdsList == null) {
			relatedIssueIdsList = new ArrayList<Long>();
		}

		return relatedIssueIdsList;
	}

	public List<IssueResult> getRelatedIssues() {
		if (relatedIssues == null) {
			relatedIssues = new ArrayList<IssueResult>();
		}

		return relatedIssues;
	}

	public StatusResult getStatus() {
		return status;
	}

	public void setAssignedTo(ContactResult assignedTo) {
		this.assignedTo = assignedTo;
	}

	public void setAttachment(long attachment) {
		this.attachment = attachment;
	}

	public void setCategory(CategoryResult category) {
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

	public void setHistoricalFixes(List<HistoricalFixResult> historicalFixes) {
		this.historicalFixes = historicalFixes;
	}

	public void setHistoricalProblems(
			List<HistoricalProblemResult> historicalProblems) {
		this.historicalProblems = historicalProblems;
	}

	public void setId(long id) {
		this.id = id;
	}

	public void setJobNumber(String jobNumber) {
		this.jobNumber = jobNumber;
	}

	public void setMoldNumber(String moldNumber) {
		this.moldNumber = moldNumber;
	}

	public void setOpenedBy(ContactResult openedBy) {
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

	public void setPriority(PriorityResult priority) {
		this.priority = priority;
	}

	public void setProblem(String problem) {
		this.problem = problem;
	}

	public void setRelatedIssueIds(String relatedIssueIds) {
		this.relatedIssueIds = relatedIssueIds;
	}

	public void setRelatedIssueIdsList(List<Long> relatedIssueIdsList) {
		this.relatedIssueIdsList = relatedIssueIdsList;
	}

	public void setRelatedIssues(List<IssueResult> relatedIssues) {
		this.relatedIssues = relatedIssues;
	}

	public void setStatus(StatusResult status) {
		this.status = status;
	}
}
