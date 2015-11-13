package com.rii.track.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class MetaData implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name = "createDate")
	private Date createDate = new Date();

	@Column(name = "updateDate")
	private Date updateDate = null;

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
}
