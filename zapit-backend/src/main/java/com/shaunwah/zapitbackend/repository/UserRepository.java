package com.shaunwah.zapitbackend.repository;

import com.shaunwah.zapitbackend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;

@Repository
@RequiredArgsConstructor
public class UserRepository {
    private final JdbcTemplate jdbcTemplate;

    private final String SQL_GET_USER_BY_ID = "select * from users where id = ? and is_deleted = false";
    private final String SQL_GET_USER_BY_EMAIL = "select * from users where email = ? and is_deleted = false";
    private final String SQL_CREATE_USER = "insert into users (email, display_name, password, first_name, last_name) values (?, ?, ?, ?, ?)";
    private final String SQL_UPDATE_USER = "update users set email = ?, display_name = ?, password = ?, first_name = ?, last_name = ? where id = ? and is_deleted = false";
    private final String SQL_UPDATE_USER_ROLES = "update users set roles = ? where id = ? and is_deleted = false";

    private final String SQL_DELETE_USER = "update users set is_deleted = true where id = ? and is_deleted = false";

    public User getUserById(Long userId) {
        return jdbcTemplate.queryForObject(SQL_GET_USER_BY_ID, BeanPropertyRowMapper.newInstance(User.class), userId);
    }

    public User getUserByEmail(String email) {
        return jdbcTemplate.queryForObject(SQL_GET_USER_BY_EMAIL, BeanPropertyRowMapper.newInstance(User.class), email);
    }

    public Long createUser(User user) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(SQL_CREATE_USER, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getEmail());
            ps.setString(2, user.getDisplayName());
            ps.setString(3, user.getPassword());
            ps.setString(4, user.getFirstName());
            ps.setString(5, user.getLastName());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    public Integer updateUser(User user) {
        return jdbcTemplate.update(SQL_UPDATE_USER, user.getEmail(), user.getDisplayName(), user.getPassword(), user.getFirstName(), user.getLastName(), user.getId());
    }

    public Integer updateUserRolesById(String roles, Long userId) {
        return jdbcTemplate.update(SQL_UPDATE_USER_ROLES, roles, userId);
    }

    public Integer deleteUser(Long userId) {
        return jdbcTemplate.update(SQL_DELETE_USER, userId);
    }
}
