package com.rii.track.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.springframework.stereotype.Service;

import com.rii.track.model.Contact;
import com.rii.track.repository.CRUDRepository;
import com.rii.track.service.model.User;
import com.rii.track.util.ConvertUtil;
import com.rii.track.util.EntityUtil;
import com.rii.track.util.FileUtil;
import com.rii.track.util.PageUtil;

@Service
public class ContactServiceImpl implements ContactService {

	private CRUDRepository<Contact> contactRepository;

	@Override
	public void uploadExcelContent(InputStream is, String fileName) {
		int count = contactRepository.getTotalItems();
		List<Row> rowList = FileUtil.readExcelRow(is, fileName);
		List<Contact> contacts = ConvertUtil.convertExcelContact(rowList);

		if (count == 0) {
			for (Contact contact : contacts) {
				contactRepository.create(contact);
			}
		} else {
			List<Contact> contactsForSave = new ArrayList<Contact>();
			List<Contact> contactsForUpdate = new ArrayList<Contact>();
			for (Contact contact : contacts) {
				String query = getQuery(contact);
				Contact actualData = contactRepository.getEntity(query);
				if (actualData != null
						&& actualData.getId() > 0
						&& ((actualData.getFirstName() != null && actualData
								.getFirstName().equalsIgnoreCase(
										contact.getFirstName())) || (actualData
								.getLastName() != null && actualData
								.getLastName().equalsIgnoreCase(
										contact.getLastName())))) {
					Contact contactForUpdate = ConvertUtil.getUpdateContact(
							actualData.getId(), contact);
					contactsForUpdate.add(contactForUpdate);
				} else {
					contactsForSave.add(contact);
				}
			}

			// Update
			for (Contact contact : contactsForUpdate) {
				contactRepository.update(contact);
			}

			// Add new
			for (Contact contact : contactsForSave) {
				contactRepository.create(contact);
			}
		}
	}

	@Override
	public void saveDafult() {

	}

	@Override
	public Contact create(Contact entity) {
		contactRepository.create(entity);

		return entity;
	}

	@Override
	public Contact update(Contact entity) {
		contactRepository.update(entity);

		return entity;
	}

	@Override
	public void delete(Contact entity) {
		contactRepository.delete(entity);
	}

	@Override
	public void deleteById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		if (entityId != -1) {
			contactRepository.deleteById(entityId);
		}
	}

	@Override
	public Contact getLastRecord() {
		Contact contact = contactRepository.getLastRow();
		if (EntityUtil.isNullEntity(contact)) {
			contact = new Contact();
		}

		return contact;
	}

	@Override
	public Contact login(User user) {
		Contact contact = new Contact();
		String query = "c.username = "
				+ EntityUtil.makeString(user.getUsername())
				+ " and c.password = "
				+ EntityUtil.makeString(user.getPassword());
		List<Contact> contacts = contactRepository.getEntities(query);
		if (EntityUtil.isValidList(contacts)) {
			contact = contacts.get(0);
		}
		return contact;
	}

	@Override
	public Contact getById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		Contact contact = contactRepository.findOne(entityId);
		if (EntityUtil.isNullEntity(contact)) {
			contact = new Contact();
			contact.setId(entityId);
		}

		return contact;
	}

	@Override
	public List<Contact> getAll(String sortDesc) {
		boolean isDesc = Boolean.parseBoolean(sortDesc);
		List<Contact> contacts = contactRepository.findAll(isDesc);

		return getContacts(contacts);
	}

	@Override
	public List<Contact> getEntitiesByPageNo(String pageNo, String itemPerPage) {
		long perPage = PageUtil.getItemPerPage(itemPerPage);
		long pageNum = PageUtil.getOffset(pageNo, itemPerPage);
		List<Contact> contacts = contactRepository.findByPage(pageNum, perPage);

		return getContacts(contacts);
	}

	@Override
	public String getQuery(Contact entity) {
		String query = "";
		if (EntityUtil.isValidString(entity.getFirstName())) {
			query = query + "c.firstName = '" + entity.getFirstName()
					+ "' and ";
		}
		if (EntityUtil.isValidString(entity.getLastName())) {
			query = query + "c.lastName = '" + entity.getLastName() + "' and ";
		}
		if (EntityUtil.isValidString(entity.getCompany())) {
			query = query + "c.company = '" + entity.getCompany() + "' and ";
		}
		if (EntityUtil.isValidString(entity.getEmailAddress())) {
			query = query + "c.emailAddress = '" + entity.getEmailAddress()
					+ "' and ";
		}
		if (EntityUtil.isValidString(entity.getJobTitle())) {
			query = query + "c.jobTitle = '" + entity.getJobTitle() + "' and ";
		}
		if (EntityUtil.isValidString(entity.getMobilePhone())) {
			query = query + "c.mobilePhone = '" + entity.getMobilePhone() + "'";
		}

		if (EntityUtil.isValidString(query) && query.endsWith(" and ")) {
			query = query.substring(0, query.length() - " and ".length());
		}

		return query;
	}

	protected List<Contact> getContacts(List<Contact> contacts) {
		if (EntityUtil.isEmpltyList(contacts)) {
			contacts = new ArrayList<Contact>();
		}

		return contacts;
	}

	public void setContactRepository(CRUDRepository<Contact> contactRepository) {
		this.contactRepository = contactRepository;
	}
}
