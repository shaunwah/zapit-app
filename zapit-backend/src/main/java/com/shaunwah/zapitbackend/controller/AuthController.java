package com.shaunwah.zapitbackend.controller;

import com.shaunwah.zapitbackend.model.User;
import com.shaunwah.zapitbackend.model.UserAuthData;
import com.shaunwah.zapitbackend.model.UserPrincipal;
import com.shaunwah.zapitbackend.service.SecurityTokenService;
import com.shaunwah.zapitbackend.service.UserService;
import com.shaunwah.zapitbackend.utility.Utilities;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(path = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Log
public class AuthController {
    private final UserService userService;
    private final SecurityTokenService securityTokenService;

    @PostMapping("/login")
    public ResponseEntity<UserAuthData> login(Authentication auth) {
        log.info("Successful login for %s. Generating token...".formatted(auth.getName()));
        String token = securityTokenService.generateToken(auth);
        if (token != null) {
            final User user = ((UserPrincipal) auth.getPrincipal()).getUser();
            return ResponseEntity.ok(new UserAuthData(token, auth.getName(), userService.getAvatarHash(user.getEmail()), user.getRoles()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .build();
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok(Utilities.returnMessageInJson("successfully logged out").toString());
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        Optional<User> createdUser = userService.createUser(user);
        if (createdUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Utilities.returnMessageInJson("successfully registered account").toString());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Utilities.returnMessageInJson("failed to register account").toString());
    }
}
