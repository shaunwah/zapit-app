package com.shaunwah.zapitbackend.repository;

import com.shaunwah.zapitbackend.model.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class TransactionRepository {
    private final JdbcTemplate jdbcTemplate; // TODO add transactionrepository
    private final String SQL_GET_TRANSACTIONS_BY_USER_ID = "select * from transactions where created_by = ?";
    private final String SQL_GET_TRANSACTION_BY_ID = "select * from transactions where id = ? and created_by = ?";
    private final String SQL_CREATE_TRANSACTION = "insert into transactions (invoice, created_by) values (?, ?)";
    private final String SQL_UPDATE_TRANSACTION = "update transactions set invoice = ? where id = ? and created_by = ?";

    public List<Transaction> getTransactionsByUserId(Long userId) {
        return jdbcTemplate.query(SQL_GET_TRANSACTIONS_BY_USER_ID, BeanPropertyRowMapper.newInstance(Transaction.class), userId);
    }

    public Transaction getTransactionById(Long transactionId, Long userId) {
        return jdbcTemplate.queryForObject(SQL_GET_TRANSACTION_BY_ID, BeanPropertyRowMapper.newInstance(Transaction.class), transactionId, userId);
    }

    public Long createTransaction(Transaction transaction) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(SQL_CREATE_TRANSACTION, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, transaction.getInvoice().getId());
            ps.setLong(2, transaction.getCreatedBy().getId());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    public Integer updateTransaction(Transaction transaction, Long userId) {
        return jdbcTemplate.update(SQL_UPDATE_TRANSACTION, transaction.getInvoice().getId(), transaction.getId(), userId);
    }
}
