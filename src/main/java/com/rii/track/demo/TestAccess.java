package com.rii.track.demo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestAccess {
	public static void populateConnection() {
		try {
			String dbPath = "D:/Rii/Rii_Tracking_Issue_v4.accdb;";
			Class.forName("sun.jdbc.odbc.JdbcOdbcDriver");
			String url = "jdbc:odbc:Driver={Microsoft Access Driver "
					+ "(*.mdb, *.accdb)};DBQ=" + dbPath;
			Connection con = DriverManager.getConnection(url);
			System.out.println("Connected!");
			con.close();
		} catch (SQLException e) {
			System.out.println("SQL Exception: " + e.toString());
		} catch (ClassNotFoundException cE) {
			System.out.println("Class Not Found Exception: " + cE.toString());
		}
	}

	public static void main(String[] args) {
		populateConnection();
	}

}
