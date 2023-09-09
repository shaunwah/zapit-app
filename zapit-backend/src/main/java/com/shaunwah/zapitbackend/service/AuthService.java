package com.shaunwah.zapitbackend.service;

import com.shaunwah.zapitbackend.model.User;
import com.shaunwah.zapitbackend.model.UserPrincipal;
import com.shaunwah.zapitbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {
    private final UserRepository userRepository;

    public User getUserByEmailAddress(String emailAddress) {
        return userRepository.getUserByEmailAddress(emailAddress);
    }

    @Override
    public UserDetails loadUserByUsername(String emailAddress) throws UsernameNotFoundException {
        User user = getUserByEmailAddress(emailAddress);
        if (user == null) {
            throw new UsernameNotFoundException("%s does not exist".formatted(emailAddress));
        }
        return new UserPrincipal(user);
    }

    private static List<GrantedAuthority> getAuthorities(List<String> roles) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        roles.forEach(role -> authorities.add(new SimpleGrantedAuthority(role)));
        return authorities;
    }
}
