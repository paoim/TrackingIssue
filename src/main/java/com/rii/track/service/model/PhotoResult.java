package com.rii.track.service.model;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class PhotoResult {

	private long id;

	private String imageLocation;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getImageLocation() {
		return imageLocation;
	}

	public void setImageLocation(String imageLocation) {
		this.imageLocation = imageLocation;
	}
}
