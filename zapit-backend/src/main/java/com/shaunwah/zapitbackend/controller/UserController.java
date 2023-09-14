package com.shaunwah.zapitbackend.controller;

import com.shaunwah.zapitbackend.model.User;
import com.shaunwah.zapitbackend.service.UserService;
import com.shaunwah.zapitbackend.utility.Utilities;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtDecoder jwtDecoder;

    @GetMapping("/user")
    public ResponseEntity<User> getUserById(HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.of(userService.getUserById(JWT_USER_ID));
    }

    @PutMapping("/users")
    public ResponseEntity<String> updateUser(@RequestBody User user, HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        user.setId(JWT_USER_ID);
        Boolean result = userService.updateUser(user);
        if (result) {
            return ResponseEntity.ok(Utilities.returnMessageInJson("successfully updated the user").toString());
        }
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Utilities.returnMessageInJson("failed to update the user").toString());
    }
}
