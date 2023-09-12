package com.shaunwah.zapitbackend.service;

import com.shaunwah.zapitbackend.model.User;
import com.shaunwah.zapitbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public String getAvatarHash(String email) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] bytes = md.digest(email.getBytes());
            BigInteger bigInteger = new BigInteger(1, bytes);
            String str = bigInteger.toString(16);
            while (str.length() < 32) {
                str = "0%s".formatted(str);
            }
            return str;
        } catch (NoSuchAlgorithmException e) {
            log.severe(e.getMessage());
            return null;
        }
    }

    public Optional<User> getUserById(Long userId) {
        return Optional.ofNullable(userRepository.getUserById(userId));
    }

    public Optional<User> getUserByEmail(String email) {
        return Optional.ofNullable(userRepository.getUserByEmail(email));
    }

    public Optional<User> createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Long userId = userRepository.createUser(user);
        if (userId != null) {
            user.setId(userId);
            return Optional.of(user);
        }
        return Optional.empty();
    }

    public Boolean updateUser(User user) {
        return userRepository.updateUser(user) > 0;
    }

    public Boolean updateUserRolesById(String roles, Long userId) {
        return userRepository.updateUserRolesById(roles, userId) > 0;
    }


    public Boolean deleteUser(Long userId) {
        return userRepository.deleteUser(userId) > 0;
    }
}
