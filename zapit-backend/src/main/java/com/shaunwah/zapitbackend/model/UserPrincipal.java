package com.shaunwah.zapitbackend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.Collection;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserPrincipal implements UserDetails {
    private User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Arrays.stream(user.getRoles().split(","))
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getDisplayName();
    }

    @Override
    public boolean isAccountNonExpired() {
        return !user.getIsDeleted();
    }

    @Override
    public boolean isAccountNonLocked() {
        return !user.getIsDeleted();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return !user.getIsDeleted();
    }

    @Override
    public boolean isEnabled() {
        return !user.getIsDeleted();
    }
}
