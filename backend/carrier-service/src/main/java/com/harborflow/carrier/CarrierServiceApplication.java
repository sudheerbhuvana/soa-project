package com.harborflow.carrier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class CarrierServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CarrierServiceApplication.class, args);
    }
}
