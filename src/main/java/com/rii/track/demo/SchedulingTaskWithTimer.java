package com.rii.track.demo;

import java.util.Timer;
import java.util.TimerTask;

public class SchedulingTaskWithTimer {

	public static void main(String[] args) {
		runEveryOneSecond();
	}

	private static void runEveryOneSecond() {
		Timer timer = new Timer();

		int startingTime = 10000; // millisecond 10 seconds = 10000
		int delayTime = 1000; // millisecond 1 second

		timer.schedule(new TimerTask() {
			@Override
			public void run() {
				System.out.println("Timer repeat statement");
			}
		}, startingTime, delayTime); // start after one second and repeat every
										// 1 second
	}
}
