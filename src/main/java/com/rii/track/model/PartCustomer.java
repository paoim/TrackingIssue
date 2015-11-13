package com.rii.track.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "part_customer")
@XmlRootElement
public class PartCustomer extends MetaData {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "PARTCUSTOMER_ID")
	@GeneratedValue
	private long id;

	@Column(name = "CustNum")
	private long custNum;

	@Column(name = "CustName")
	private String custName;

	@Column(name = "CustID")
	private String custId;

	@Column(name = "PartNum")
	private String partNum;

	@Column(name = "PartDescription", columnDefinition = "LONGTEXT")
	private String partDescription;

	public String toString() {
		return "" + id + " " + custNum + " " + custName + " " + custId + " "
				+ partNum + " " + partDescription;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getCustNum() {
		return custNum;
	}

	public void setCustNum(long custNum) {
		this.custNum = custNum;
	}

	public String getCustName() {
		return custName;
	}

	public void setCustName(String custName) {
		this.custName = custName;
	}

	public String getCustId() {
		return custId;
	}

	public void setCustId(String custId) {
		this.custId = custId;
	}

	public String getPartNum() {
		return partNum;
	}

	public void setPartNum(String partNum) {
		this.partNum = partNum;
	}

	public String getPartDescription() {
		return partDescription;
	}

	public void setPartDescription(String partDescription) {
		this.partDescription = partDescription;
	}
}
