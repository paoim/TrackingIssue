package com.rii.track.util;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class FileUtil {

	public static List<String> convertInputStream(InputStream in) {
		BufferedReader br = null;
		List<String> lines = new ArrayList<String>();

		try {
			br = new BufferedReader(new InputStreamReader(in, "UTF-8"));
			String line = null;
			while ((line = br.readLine()) != null) {
				lines.add(line);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

		return lines;
	}

	public static Workbook getWorkbook(String fileName) {
		Workbook workbook = null;
		FileInputStream fis = null;
		try {
			fis = new FileInputStream(fileName);
			if (fileName.toLowerCase().endsWith("xlsx")) {
				workbook = new XSSFWorkbook(fis);
			} else if (fileName.toLowerCase().endsWith("xls")) {
				workbook = new HSSFWorkbook(fis);
			} else {
				throw new IOException(
						"invalid file name, should be xls or xlsx");
			}

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fis != null) {
				try {
					fis.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

		return workbook;
	}

	public static Workbook getWorkbook(InputStream is) throws IOException {
		Workbook workbook = null;
		workbook = new XSSFWorkbook(is);

		return workbook;
	}

	public static Workbook getWorkbook(InputStream is, String fileName)
			throws IOException {
		// Create Workbook instance for xlsx/xls file input stream
		Workbook workbook = null;
		if (fileName.toLowerCase().endsWith("xlsx")) {
			workbook = new XSSFWorkbook(is);
		} else if (fileName.toLowerCase().endsWith("xls")) {
			workbook = new HSSFWorkbook(is);
		} else {
			throw new IOException("invalid file name, should be xls or xlsx");
		}

		return workbook;
	}

	public static List<Row> readExcelRow(InputStream is, String fileName) {
		List<Row> rowList = new ArrayList<Row>();
		try {
			Workbook workbook = getWorkbook(is, fileName);
			rowList = getRowList(workbook);
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

		return rowList;
	}

	public static List<Cell> readExcelCell(InputStream is, String fileName) {
		List<Cell> cellSheets = new ArrayList<Cell>();
		try {
			Workbook workbook = getWorkbook(is, fileName);
			cellSheets = getCellSheets(workbook);
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

		return cellSheets;
	}

	public static List<Row> getRowList(Workbook workbook) {
		List<Row> rowList = new ArrayList<Row>();
		if (workbook != null) {
			// Get the number of sheets in the xlsx file
			int numberOfSheets = workbook.getNumberOfSheets();

			// loop through each of the sheets
			for (int i = 0; i < numberOfSheets; i++) {

				// Get the nth sheet from the workbook
				Sheet sheet = workbook.getSheetAt(i);

				// every sheet has rows, iterate over them
				Iterator<Row> rowIterator = sheet.iterator();
				while (rowIterator.hasNext()) {
					// Get the row object
					Row row = rowIterator.next();
					rowList.add(row);
				}
			}
		}

		return rowList;
	}

	public static List<Cell> getCellSheets(Workbook workbook) {
		List<Cell> cellSheets = new ArrayList<Cell>();
		if (workbook != null) {
			// Get the number of sheets in the xlsx file
			int numberOfSheets = workbook.getNumberOfSheets();

			// loop through each of the sheets
			for (int i = 0; i < numberOfSheets; i++) {

				// Get the nth sheet from the workbook
				Sheet sheet = workbook.getSheetAt(i);

				// every sheet has rows, iterate over them
				Iterator<Row> rowIterator = sheet.iterator();
				while (rowIterator.hasNext()) {
					// Get the row object
					Row row = rowIterator.next();

					// Every row has columns, get the column iterator and
					// iterate over them
					Iterator<Cell> cellIterator = row.cellIterator();
					while (cellIterator.hasNext()) {
						// Get the Cell object
						Cell cell = cellIterator.next();
						cellSheets.add(cell);
					}
				}
			}
		}

		return cellSheets;
	}

	public static byte[] getBytesFromInputStream(InputStream is)
			throws IOException {
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		byte[] buffer = new byte[0xFFFF];

		for (int len; (len = is.read(buffer)) != -1;)
			os.write(buffer, 0, len);

		os.flush();

		return os.toByteArray();
	}

	public static byte[] convertInputStreamToByte_PlainJava(InputStream is,
			int availableSize) throws IOException {
		// default image's size is 500 * 1024 bytes
		int defaultSize = 500 * 1024;
		int fileSize = availableSize >= defaultSize ? availableSize
				: defaultSize;
		byte[] imageData = new byte[fileSize];
		is.read(imageData);

		return imageData;
	}

	public static byte[] convertInputStreamToByte_IOUtils(InputStream is)
			throws IOException {

		return IOUtils.toByteArray(is);
	}

	/**
	 * Get size of file in MB
	 * 
	 * @param fileName
	 * @return
	 * @throws IOException
	 */
	public static float getFileSizeAsMB(String fileName) throws IOException {
		long fileSize = 0;
		File newFile = new File(fileName);
		if (newFile.isFile()) {
			fileSize = newFile.length();
			fileSize = (fileSize / (1024 * 1024));
		}

		return fileSize;
	}

	/**
	 * save uploaded file to new location
	 * 
	 * @param uploadedInputStream
	 * @param uploadedFileLocation
	 */
	public static void saveUploadFile(InputStream uploadedInputStream,
			String uploadedFileLocation) {
		try {
			int read = 0;
			int availableSize = uploadedInputStream.available();
			// default image's size is 1024
			int fileSize = availableSize >= 1024 ? availableSize : 1024;
			byte[] bytes = new byte[fileSize];

			OutputStream out = new FileOutputStream(
					getFile(uploadedFileLocation));
			while ((read = uploadedInputStream.read(bytes)) != -1) {
				out.write(bytes, 0, read);
			}

			out.flush();
			out.close();
		} catch (IOException e) {

			e.printStackTrace();
		}

		// Reference:
		// http://www.mkyong.com/webservices/jax-rs/file-upload-example-in-jersey/
	}

	public static void readAndSaveFile(InputStream in, String fileName)
			throws IOException {
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		byte[] buf = new byte[1024];

		for (int readNum; (readNum = in.read(buf)) != -1;) {
			bos.write(buf, 0, readNum); // no doubt here is 0
			// Writes len bytes from the specified byte array starting at offset
			// off to this byte array output stream.
			System.out.println("read " + readNum + " bytes,");
		}

		byte[] bytes = bos.toByteArray();

		// below is the different part
		saveFileByFOS(bytes, fileName);
	}

	/**
	 * Save file into somewhere by BufferedOutputStream
	 * 
	 * @param content
	 * @param filename
	 * @throws IOException
	 */
	public static void saveFileByBOF(byte[] content, String fileName)
			throws IOException {

		FileOutputStream fos = new FileOutputStream(getFile(fileName));
		BufferedOutputStream bos = new BufferedOutputStream(fos);

		bos.write(content);
		bos.flush();
		bos.close();
	}

	/**
	 * Save file into somewhere by FileOutputStream
	 * 
	 * @param content
	 * @param filename
	 * @throws IOException
	 */
	public static void saveFileByFOS(byte[] content, String fileName)
			throws IOException {
		FileOutputStream fop = new FileOutputStream(getFile(fileName));

		fop.write(content);
		fop.flush();
		fop.close();
	}

	public static File getFile(String fileName) throws IOException {
		File file = new File(fileName);

		if (!file.exists()) {
			file.createNewFile();
		}

		return file;
	}

	public static void cleanDirectory(String imageLocation,
			boolean isDeleteItSelf) throws IOException {
		File file = new File(imageLocation);
		if (file.exists() && file.isDirectory()) {
			String strFiles[] = file.list();
			if (strFiles.length == 0 && isDeleteItSelf) {
				file.delete();
			} else {
				for (String strFile : strFiles) {
					File fileToDelete = new File(file, strFile);
					if (fileToDelete.exists()) {
						fileToDelete.delete();
					}
				}
			}
		}
	}

}

// Reference:
// http://www.journaldev.com/2562/java-readwrite-excel-file-using-apache-poi-api