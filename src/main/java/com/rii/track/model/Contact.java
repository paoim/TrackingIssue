package com.rii.track.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "contact")
@XmlRootElement
public class Contact extends MetaData {

	private static final long serialVersionUID = 1L;

	@Column(name = "address")
	private String address;

	@Column(name = "attachment")
	// Photo ID
	private long attachment;

	@Column(name = "businessPhone")
	private String businessPhone;

	@Column(name = "city")
	private String city;

	@Column(name = "company")
	private String company;

	@Column(name = "countryRegion")
	private String countryRegion;

	@Column(name = "emailAddress")
	private String emailAddress;

	@Column(name = "faxNumber")
	private String faxNumber;

	@Column(name = "firstName")
	private String firstName;

	@Column(name = "homePhone")
	private String homePhone;

	@Id
	@Column(name = "CONTACT_ID")
	@GeneratedValue
	private long id;

	@Column(name = "jobTitle")
	private String jobTitle;

	@Column(name = "lastName")
	private String lastName;

	@Column(name = "mobilePhone")
	private String mobilePhone;

	@Column(name = "note")
	private String note;

	@Column(name = "password")
	private String password;

	@Column(name = "stateProvince")
	private String stateProvince;

	@Column(name = "username")
	private String username;

	@Column(name = "webPage")
	private String webPage;

	@Column(name = "zipPostalCode")
	private String zipPostalCode;

	public String getAddress() {
		return address;
	}

	public long getAttachment() {
		return attachment;
	}

	public String getBusinessPhone() {
		return businessPhone;
	}

	public String getCity() {
		return city;
	}

	public String getCompany() {
		return company;
	}

	public String getCountryRegion() {
		return countryRegion;
	}

	public String getEmailAddress() {
		return emailAddress;
	}

	public String getFaxNumber() {
		return faxNumber;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getHomePhone() {
		return homePhone;
	}

	public long getId() {
		return id;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public String getLastName() {
		return lastName;
	}

	public String getMobilePhone() {
		return mobilePhone;
	}

	public String getNote() {
		return note;
	}

	public String getPassword() {
		return password;
	}

	public String getStateProvince() {
		return stateProvince;
	}

	public String getUsername() {
		return username;
	}

	public String getWebPage() {
		return webPage;
	}

	public String getZipPostalCode() {
		return zipPostalCode;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public void setAttachment(long attachment) {
		this.attachment = attachment;
	}

	public void setBusinessPhone(String businessPhone) {
		this.businessPhone = businessPhone;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public void setCountryRegion(String countryRegion) {
		this.countryRegion = countryRegion;
	}

	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}

	public void setFaxNumber(String faxNumber) {
		this.faxNumber = faxNumber;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public void setHomePhone(String homePhone) {
		this.homePhone = homePhone;
	}

	public void setId(long id) {
		this.id = id;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public void setMobilePhone(String mobilePhone) {
		this.mobilePhone = mobilePhone;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setStateProvince(String stateProvince) {
		this.stateProvince = stateProvince;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setWebPage(String webPage) {
		this.webPage = webPage;
	}

	public void setZipPostalCode(String zipPostalCode) {
		this.zipPostalCode = zipPostalCode;
	}
}
