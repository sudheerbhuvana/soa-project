package com.harborflow.auth.client;

import com.harborflow.auth.dto.CarrierAuthResponse;
import com.harborflow.auth.dto.CarrierCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@Component
public class CarrierServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${carrier.service.url:http://localhost:8082}")
    private String carrierServiceUrl;

    public CarrierAuthResponse verifyCredentials(String email, String password) {
        String url = carrierServiceUrl + "/carriers/internal/verify";
        CarrierCredentials creds = new CarrierCredentials();
        creds.setEmail(email);
        creds.setPassword(password);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            ResponseEntity<CarrierAuthResponse> resp = restTemplate.postForEntity(
                url, new HttpEntity<>(creds, headers), CarrierAuthResponse.class);
            return resp.getBody();
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}