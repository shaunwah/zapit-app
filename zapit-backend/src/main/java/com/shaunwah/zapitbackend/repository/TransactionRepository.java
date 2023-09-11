package com.shaunwah.zapitbackend.repository;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shaunwah.zapitbackend.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
@Log
public class TransactionRepository {
    private final JdbcTemplate jdbcTemplate;
    private final String SQL_GET_TRANSACTIONS_TOTAL_BY_USER_ID = "select sum(t.amount) from transactions t join cards c on c.id = t.card left join location_data ld on ld.id = t.location_data where c.user = ? and c.is_deleted = false order by t.created_on desc limit 1";
    private final String SQL_GET_TRANSACTIONS_BY_USER_ID = "select t.*, ld.* from transactions t join cards c on c.id = t.card left join location_data ld on ld.id = t.location_data where c.user = ? and c.is_deleted = false order by t.created_on desc limit ? offset ?";
    private final String SQL_GET_TRANSACTIONS_BY_CARD_ID = "select t.*, ld.* from transactions t join cards c on c.id = t.card left join location_data ld on ld.id = t.location_data where t.card = ? and c.user = ? and c.is_deleted = false order by t.created_on desc limit ? offset ?";
    private final String SQL_GET_TRANSACTION_BY_ID = "select * from transactions t join cards c on c.id = t.card join merchants m on m.id = c.issued_by left join location_data ld on t.location_data = ld.id where t.id = ? and c.user = ? limit 1";
    private final String SQL_CREATE_TRANSACTION = "insert into transactions (card, amount, status, location_data) values (?, ?, ?, ?)";

    public List<Transaction> getTransactionsByUserId(Long userId, Integer limit, Integer offset) {
        try {
            return jdbcTemplate.query(SQL_GET_TRANSACTIONS_BY_USER_ID, (rs) -> {
                List<Transaction> transactions = new ArrayList<>();
                while (rs.next()) {
                    Transaction transaction = new Transaction();
                    transaction.setId(rs.getLong("id"));
                    transaction.setCard(new Card(rs.getString("card")));
                    transaction.setAmount(rs.getDouble("amount"));
                    transaction.setStatus(rs.getBoolean("status"));
                    transaction.setLocation(new LocationData(rs.getBigDecimal("latitude"), rs.getBigDecimal("longitude")));
                    transaction.setCreatedOn(rs.getTimestamp("created_on"));
                    transaction.setUpdatedOn(rs.getTimestamp("updated_on"));
                    transactions.add(transaction);
                }
                return transactions;
            }, userId, limit, offset);
        } catch (Exception e) {
            log.severe(e.getMessage());
            return null;
        }
    }

    public List<Transaction> getTransactionsByCardId(String cardId, Long userId, Integer limit, Integer offset) {
        try {
            return jdbcTemplate.query(SQL_GET_TRANSACTIONS_BY_CARD_ID, (rs) -> {
                List<Transaction> transactions = new ArrayList<>();
                while (rs.next()) {
                    Transaction transaction = new Transaction();
                    transaction.setId(rs.getLong("id"));
                    transaction.setCard(new Card(rs.getString("card")));
                    transaction.setAmount(rs.getDouble("amount"));
                    transaction.setStatus(rs.getBoolean("status"));
                    transaction.setLocation(new LocationData(rs.getBigDecimal("latitude"), rs.getBigDecimal("longitude")));
                    transaction.setCreatedOn(rs.getTimestamp("created_on"));
                    transaction.setUpdatedOn(rs.getTimestamp("updated_on"));
                    transactions.add(transaction);
                }
                return transactions;
            }, cardId, userId, limit, offset);
        } catch (Exception e) {
            log.severe(e.getMessage());
            return null;
        }
    }

    public Transaction getTransactionById(Long transactionId, Long userId) {
        try {
            return jdbcTemplate.query(SQL_GET_TRANSACTION_BY_ID, (rs) -> {
                if (rs.next()) {
                    Transaction transaction = new Transaction();
                    transaction.setId(rs.getLong("id"));
                    Card card = new Card();
                    card.setId(rs.getString("card"));
                    Merchant merchant = new Merchant();
                    merchant.setId(rs.getLong("m.id"));
                    merchant.setName(rs.getString("name"));
                    card.setIssuedBy(merchant);
                    transaction.setCard(card);
                    transaction.setAmount(rs.getDouble("amount"));
                    transaction.setStatus(rs.getBoolean("status"));
                    transaction.setLocation(new LocationData(rs.getBigDecimal("latitude"), rs.getBigDecimal("longitude")));
                    transaction.setCreatedOn(rs.getTimestamp("created_on"));
                    transaction.setUpdatedOn(rs.getTimestamp("updated_on"));
                    return transaction;
                }
                return null;
            }, transactionId, userId);
        } catch (Exception e) {
            log.severe(e.getMessage());
            return null;
        }
    }

    public Double getTransactionsTotalByUserId(Long userId) {
        return jdbcTemplate.queryForObject(SQL_GET_TRANSACTIONS_TOTAL_BY_USER_ID, Double.class, userId);
    }

    public Long createTransaction(Transaction transaction) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(SQL_CREATE_TRANSACTION, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, transaction.getCard().getId());
            ps.setDouble(2, transaction.getAmount());
            ps.setBoolean(3, true); // TODO
            ps.setLong(4, transaction.getLocation().getId());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }
}
