package com.shaunwah.zapitbackend.service;

import com.shaunwah.zapitbackend.model.User;
import com.shaunwah.zapitbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
