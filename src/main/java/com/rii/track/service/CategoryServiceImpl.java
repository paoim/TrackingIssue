package com.rii.track.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.springframework.stereotype.Service;

import com.rii.track.model.Category;
import com.rii.track.repository.CRUDRepository;
import com.rii.track.util.ConvertUtil;
import com.rii.track.util.EntityUtil;
import com.rii.track.util.FileUtil;
import com.rii.track.util.PageUtil;

@Service
public class CategoryServiceImpl implements CRUDService<Category, Category> {

	private CRUDRepository<Category> categoryRepository;

	@Override
	public void uploadExcelContent(InputStream is, String fileName) {
		int count = categoryRepository.getTotalItems();
		List<Row> rowList = FileUtil.readExcelRow(is, fileName);
		List<Category> categories = ConvertUtil.convertExcelCategory(rowList);

		if (count == 0) {
			for (Category category : categories) {
				categoryRepository.create(category);
			}
		} else {
			List<Category> categoriesForSave = new ArrayList<Category>();
			List<Category> categoriesForUpdate = new ArrayList<Category>();
			for (Category category : categories) {
				String query = getQuery(category);
				Category actualData = categoryRepository.getEntity(query);
				if (actualData != null
						&& actualData.getId() > 0
						&& actualData.getName().equalsIgnoreCase(
								category.getName())) {
					Category categoryForUpdate = ConvertUtil.getUpdateCategory(
							actualData.getId(), category);
					categoriesForUpdate.add(categoryForUpdate);
				} else {
					categoriesForSave.add(category);
				}
			}

			// Save
			for (Category category : categoriesForSave) {
				categoryRepository.create(category);
			}

			// Update
			for (Category category : categoriesForUpdate) {
				categoryRepository.update(category);
			}
		}
	}

	@Override
	public void saveDafult() {
		Category category = new Category();
		category.setName("(1) Category");
		category.setDescription("This is first category for production.");
		upsertCategory(category);

		category = new Category();
		category.setName("(2) Category");
		category.setDescription("This is second category for production.");
		upsertCategory(category);

		category = new Category();
		category.setName("(3) Category");
		category.setDescription("This is third category for production.");
		upsertCategory(category);
	}

	/**
	 * Add new record if it does not exist
	 * 
	 * @param category
	 */
	private void upsertCategory(Category category) {
		String query = getQuery(category);
		Category actualData = categoryRepository.getEntity(query);

		if (actualData == null
				|| (actualData != null && actualData.getId() == 0)) {
			categoryRepository.create(category);
		}
	}

	@Override
	public Category create(Category entity) {
		categoryRepository.create(entity);

		return entity;
	}

	@Override
	public Category update(Category entity) {
		categoryRepository.update(entity);

		return entity;
	}

	@Override
	public void delete(Category entity) {
		categoryRepository.delete(entity);
	}

	@Override
	public void deleteById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		if (entityId != -1) {
			categoryRepository.deleteById(entityId);
		}
	}

	@Override
	public Category getLastRecord() {
		Category category = categoryRepository.getLastRow();
		if (EntityUtil.isNullEntity(category)) {
			category = new Category();
		}

		return category;
	}

	@Override
	public Category getById(String id) {
		long entityId = ConvertUtil.getLongId(id);
		Category category = categoryRepository.findOne(entityId);
		if (EntityUtil.isNullEntity(category)) {
			category = new Category();
			category.setId(entityId);
			category.setName("(1) Category");
			category.setDescription("This is first category for production.");
		}

		return category;
	}

	@Override
	public List<Category> getAll(String sortDesc) {
		boolean isDesc = Boolean.parseBoolean(sortDesc);
		List<Category> categories = categoryRepository.findAll(isDesc);

		return getCategories(categories);
	}

	@Override
	public List<Category> getEntitiesByPageNo(String pageNo, String itemPerPage) {
		long perPage = PageUtil.getItemPerPage(itemPerPage);
		long pageNum = PageUtil.getOffset(pageNo, itemPerPage);
		List<Category> categories = categoryRepository.findByPage(pageNum,
				perPage);

		return getCategories(categories);
	}

	protected List<Category> getCategories(List<Category> categories) {
		if (EntityUtil.isEmpltyList(categories)) {
			categories = new ArrayList<Category>();
			/*
			 * Category category = new Category(); category.setId(1);
			 * category.setName("(1) Category");
			 * category.setDescription("This is first category for production."
			 * ); categories.add(category);
			 * 
			 * category = new Category(); category.setId(2);
			 * category.setName("(2) Category");
			 * category.setDescription("This is second category for production."
			 * ); categories.add(category);
			 * 
			 * category = new Category(); category.setId(3);
			 * category.setName("(3) Category");
			 * category.setDescription("This is third category for production."
			 * ); categories.add(category);
			 */
		}

		return categories;
	}

	@Override
	public String getQuery(Category entity) {
		String query = "";
		if (EntityUtil.isValidString(entity.getName())) {
			query = query + "cat.name = '" + entity.getName() + "'";
		}

		return query;
	}

	public void setCategoryRepository(
			CRUDRepository<Category> categoryRepository) {
		this.categoryRepository = categoryRepository;
	}
}
