package org.example.tradequestapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TradeQuestAppApplication {
	public static void main(String[] args) {
		SpringApplication.run(TradeQuestAppApplication.class, args);
	}

}
