package com.shaunwah.zapitbackend.service;

import com.shaunwah.zapitbackend.model.User;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
@Log
public class MailService {
    @Value("${mailgun.api.url}")
    private String apiUrl;
    @Value("${mailgun.api.key}")
    private String apiKey;
    @Value("${mailgun.sender.email}")
    private String senderEmail;

    public ResponseEntity<String> sendWelcomeEmail(User user) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("from", senderEmail);
        body.add("to", user.getEmail());
        body.add("subject", "Welcome to Zapit!");
        body.add("text", "Welcome to Zapit, %s!".formatted(user.getDisplayName()));

        RequestEntity<MultiValueMap<String, String>> request = RequestEntity
                .post(apiUrl)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body);

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors().add(
                new BasicAuthenticationInterceptor("api", apiKey)
        );

        log.info("welcome email sent to %s".formatted(user.getEmail()));
        return restTemplate.exchange(request, String.class);
    }

    public ResponseEntity<String> sendAccountUpdatedEmail(User user) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("from", senderEmail);
        body.add("to", user.getEmail());
        body.add("subject", "Account Information Updated");
        body.add("text", "Your account information has been updated.");

        RequestEntity<MultiValueMap<String, String>> request = RequestEntity
                .post(apiUrl)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body);

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors().add(
                new BasicAuthenticationInterceptor("api", apiKey)
        );

        log.info("account updated email sent to %s".formatted(user.getEmail()));
        return restTemplate.exchange(request, String.class);
    }
}
