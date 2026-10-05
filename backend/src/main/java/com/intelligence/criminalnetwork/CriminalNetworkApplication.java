package com.intelligence.criminalnetwork;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CriminalNetworkApplication {

    public static void main(String[] args) {
        SpringApplication.run(CriminalNetworkApplication.class, args);
    }
}
