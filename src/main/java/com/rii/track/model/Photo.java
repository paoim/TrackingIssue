package com.rii.track.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "photo")
@XmlRootElement
public class Photo extends MetaData {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "PHOTO_ID")
	@GeneratedValue
	private long id;

	@Column(name = "ImageName")
	private String imageName;

	@Column(name = "attachments", nullable = false, length = 100000)
	private byte[] data;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getImageName() {
		return imageName;
	}

	public void setImageName(String imageName) {
		this.imageName = imageName;
	}

	public byte[] getData() {
		return data;
	}

	public void setData(byte[] data) {
		this.data = data;
	}
}
