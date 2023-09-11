package com.shaunwah.zapitbackend.repository;

import com.shaunwah.zapitbackend.model.Merchant;
import com.shaunwah.zapitbackend.model.Transaction;
import com.shaunwah.zapitbackend.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;

@Repository
@RequiredArgsConstructor
@Log
public class MerchantRepository {
    private final JdbcTemplate jdbcTemplate;

    private final String SQL_GET_MERCHANT_BY_ID = "select * from merchants where id = ? and is_deleted = false limit 1";
    private final String SQL_GET_MERCHANT_BY_USER_ID = "select * from merchants where created_by = ? and is_deleted = false limit 1";
    private final String SQL_CREATE_MERCHANT = "insert into merchants (name, website, address, post_code, created_by) values (?, ?, ?, ?, ?)";
    private final String SQL_UPDATE_MERCHANT = "update merchants set name = ?, website = ?, address = ?, post_code = ? where id = ? and is_deleted = false";
    private final String SQL_DELETE_MERCHANT = "update merchants set is_deleted = true where id = ? and is_deleted = false";

    public Merchant getMerchantById(Long merchantId) {
        try {
            return jdbcTemplate.query(SQL_GET_MERCHANT_BY_ID, (rs) -> {
                if (rs.next()) {
                    Merchant merchant = new Merchant();
                    merchant.setId(rs.getLong("id"));
                    merchant.setName(rs.getString("name"));
                    merchant.setWebsite(rs.getString("website"));
                    merchant.setAddress(rs.getString("address"));
                    merchant.setPostCode(rs.getString("post_code"));
                    merchant.setIsDeleted(rs.getBoolean("is_deleted"));
                    merchant.setCreatedBy(new User(rs.getLong("created_by")));
                    merchant.setCreatedOn(rs.getTimestamp("created_on"));
                    merchant.setUpdatedOn(rs.getTimestamp("updated_on"));
                    return merchant;
                }
                return null;
            }, merchantId);
        } catch (Exception e) {
            log.severe(e.getMessage());
            return null;
        }
    }

    public Merchant getMerchantByUserId(Long userId) {
        try {
            return jdbcTemplate.query(SQL_GET_MERCHANT_BY_USER_ID, (rs) -> {
                if (rs.next()) {
                    Merchant merchant = new Merchant();
                    merchant.setId(rs.getLong("id"));
                    merchant.setName(rs.getString("name"));
                    merchant.setWebsite(rs.getString("website"));
                    merchant.setAddress(rs.getString("address"));
                    merchant.setPostCode(rs.getString("post_code"));
                    merchant.setIsDeleted(rs.getBoolean("is_deleted"));
                    merchant.setCreatedBy(new User(rs.getLong("created_by")));
                    merchant.setCreatedOn(rs.getTimestamp("created_on"));
                    merchant.setUpdatedOn(rs.getTimestamp("updated_on"));
                    return merchant;
                }
                return null;
            }, userId);
        } catch (Exception e) {
            log.severe(e.getMessage());
            return null;
        }
    }

    public Long createMerchant(Merchant merchant) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(SQL_CREATE_MERCHANT, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, merchant.getName());
            ps.setString(2, merchant.getWebsite());
            ps.setString(3, merchant.getAddress());
            ps.setString(4, merchant.getPostCode());
            ps.setLong(5, merchant.getCreatedBy().getId());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    public Integer updateMerchant(Merchant merchant) {
        return jdbcTemplate.update(SQL_UPDATE_MERCHANT, merchant.getName(), merchant.getWebsite(), merchant.getAddress(), merchant.getPostCode(), merchant.getId());
    }

    public Integer deleteMerchant(Long merchantId) {
        return jdbcTemplate.update(SQL_DELETE_MERCHANT, merchantId);
    }
}
