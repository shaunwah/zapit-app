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
    private final String SQL_GET_USER_BY_EMAIL = "select * from users where email_address = ? and is_deleted = false";
    private final String SQL_CREATE_USER = "insert into users (email_address, username, password, first_name, last_name) values (?, ?, ?, ?, ?)";
    private final String SQL_UPDATE_USER = "update users set email_address = ?, username = ?, password = ?, first_name = ?, last_name = ? where id = ? and is_deleted = false";
    private final String SQL_DELETE_USER = "update users set is_deleted = true where id = ? and is_deleted = false";

    public User getUserById(Long userId) {
        return jdbcTemplate.queryForObject(SQL_GET_USER_BY_ID, BeanPropertyRowMapper.newInstance(User.class), userId);
    }

    public User getUserByEmailAddress(String emailAddress) {
        System.out.println("test");
        return jdbcTemplate.queryForObject(SQL_GET_USER_BY_EMAIL, BeanPropertyRowMapper.newInstance(User.class), emailAddress);
    }

    public Long createUser(User user) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(SQL_CREATE_USER, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getEmailAddress());
            ps.setString(2, user.getUsername());
            ps.setString(3, user.getPassword());
            ps.setString(4, user.getFirstName());
            ps.setString(5, user.getLastName());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    public Integer updateUser(User user) {
        return jdbcTemplate.update(SQL_UPDATE_USER, user.getEmailAddress(), user.getUsername(), user.getPassword(), user.getFirstName(), user.getLastName(), user.getId());
    }

    public Integer deleteUser(Long userId) {
        return jdbcTemplate.update(SQL_DELETE_USER, userId);
    }
}
