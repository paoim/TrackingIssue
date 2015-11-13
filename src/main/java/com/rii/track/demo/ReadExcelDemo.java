package com.rii.track.demo;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.StringTokenizer;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;

import com.rii.track.model.HistoricalProblem;
import com.rii.track.model.Issue;
import com.rii.track.util.ConvertUtil;
import com.rii.track.util.FileUtil;

public class ReadExcelDemo {

	public static void main(String[] args) {
		// readCustomerPart();
		// readIssues();
		// readCommentsHistory();
		int a = 312;
		int b = 4;
		int c = a >> b;
		System.out.println(c);

		StringBuffer s = new StringBuffer("Test123");
		s.reverse();
		System.out.println(s);

		StringTokenizer st = new StringTokenizer("Java is fun!");
		while (st.hasMoreTokens()) {
			System.out.println(st.nextToken());
		}
	}

	public static void readHistoricalProblem() {
		String filePath = "/data/QueryCommentsSource.xlsx";
		InputStream is = null;
		try {
			is = ReadExcelDemo.class.getResourceAsStream(filePath);
			Workbook workbook = FileUtil.getWorkbook(is);

			List<Row> rowList = FileUtil.getRowList(workbook);
			List<HistoricalProblem> historicalProblems = ConvertUtil
					.convertExcelHistoricalProblem(rowList);
			for (HistoricalProblem hp : historicalProblems) {
				System.out.println("[" + hp.getIssueID() + "]"
						+ hp.getVersionProblem());
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (is != null) {
				try {
					is.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	public static void readIssues() {
		String filePath = "/data/QueryIssues.xlsx";
		InputStream is = null;
		try {
			is = ReadExcelDemo.class.getResourceAsStream(filePath);
			Workbook workbook = FileUtil.getWorkbook(is);

			List<Row> rowList = FileUtil.getRowList(workbook);
			List<Issue> issues = ConvertUtil.convertExcelIssue(rowList);
			for (Issue issue : issues) {
				System.out.println("OpenDate: " + issue.getOpenedDate()
						+ " - Due Date: " + issue.getDueDate());
			}

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (is != null) {
				try {
					is.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	public static void readCustomerPart() {
		String filePath = "/data/CustomerPartNumRelation.xlsx";
		InputStream is = null;
		try {
			is = ReadExcelDemo.class.getResourceAsStream(filePath);
			Workbook workbook = FileUtil.getWorkbook(is);

			List<Row> rowList = FileUtil.getRowList(workbook);
			for (int r = 0; r < rowList.size(); r++) {
				Row row = rowList.get(r);
				Cell cell = row.getCell(4);
				switch (cell.getCellType()) {
				case Cell.CELL_TYPE_STRING:
					System.out.println("String Cell: ");
					System.out.println(cell.getStringCellValue());
					break;
				case Cell.CELL_TYPE_NUMERIC:
					if (DateUtil.isCellDateFormatted(cell)) {
						System.out.println("Date Cell: ");
						System.out.println(cell.getDateCellValue());
					} else {
						System.out.println("Number Cell: ");
						System.out.println(cell.getNumericCellValue());
					}
					break;
				}
			}

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (is != null) {
				try {
					is.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	public static void readExcelFile(String filePath) {
		InputStream is = null;
		try {
			is = ReadExcelDemo.class.getResourceAsStream(filePath);
			Workbook workbook = FileUtil.getWorkbook(is);

			List<Cell> cellSheets = FileUtil.getCellSheets(workbook);
			for (Cell cell : cellSheets) {
				// check the cell type and process accordingly
				switch (cell.getCellType()) {
				case Cell.CELL_TYPE_STRING:
					System.out.println("String Cell: ");
					System.out.println(cell.getStringCellValue());
					break;
				case Cell.CELL_TYPE_NUMERIC:
					if (DateUtil.isCellDateFormatted(cell)) {
						System.out.println("Date Cell: ");
						System.out.println(cell.getDateCellValue());
					} else {
						System.out.println("Number Cell: ");
						System.out.println(cell.getNumericCellValue());
					}
					break;
				}
			}

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (is != null) {
				try {
					is.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	public static void readFileByInputStream(String filePath) {
		InputStream is = ReadExcelDemo.class.getResourceAsStream(filePath);
		List<String> lines = FileUtil.convertInputStream(is);
		for (String line : lines) {
			System.out.println(line);
		}
	}

}
