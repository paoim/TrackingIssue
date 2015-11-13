package com.rii.track.service;

import java.util.List;

import com.rii.track.model.Photo;

public interface PhotoRelatedService {

	Photo getLastPhotoByteArray();

	List<Photo> getPhotosByteArray();

	Photo getPhotoByteArray(String id);
}
