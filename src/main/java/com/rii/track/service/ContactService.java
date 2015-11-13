package com.rii.track.service;

import com.rii.track.model.Contact;
import com.rii.track.service.model.User;

public interface ContactService extends CRUDService<Contact, Contact> {

	Contact login(User user);
}
