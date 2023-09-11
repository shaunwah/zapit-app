package com.shaunwah.zapitbackend.repository;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shaunwah.zapitbackend.model.Card;
import com.shaunwah.zapitbackend.model.Merchant;
import com.shaunwah.zapitbackend.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
@Log
public class CardRepository {
    private final JdbcTemplate jdbcTemplate;
    private final String SQL_GET_CARDS_BY_USER_ID = "select * from cards c join merchants m on m.id = c.issued_by where c.user = ? and c.is_deleted = false and m.is_deleted = false limit ?";

    private final String SQL_GET_CARD_BY_ID = "select * from cards c join merchants m on m.id = c.issued_by where c.id = ? and (c.user = ? or c.issued_by = (select id from merchants m2 where m2.created_by = ? limit 1)) and c.is_deleted = false and m.is_deleted = false limit 1";

    private final String SQL_GET_CARD_BY_MERCHANT_ID = "select * from cards c join merchants m on m.id = c.issued_by where c.issued_by = ? and c.user = ? and c.is_deleted = false and m.is_deleted = false";
    private final String SQL_CREATE_CARD = "insert into cards (id, user, balance, issued_by) values (?, ?, ?, ?)";
    private final String SQL_UPDATE_ADD_TO_CARD = "update cards set balance = (balance + ?) where id = ? and user = ? and is_deleted = false";
    private final String SQL_UPDATE_DEDUCT_FROM_CARD = "update cards set balance = (balance - ?) where id = ? and user = ? and is_deleted = false";

    private final String SQL_DELETE_CARD = "update cards set is_deleted = true where id = ? and user = ? and is_deleted = false";

    public List<Card> getCardsByUserId(Long userId, Integer limit) {
        try {
            return jdbcTemplate.query(SQL_GET_CARDS_BY_USER_ID, (rs) -> {
                List<Card> cards = new ArrayList<>();
                while (rs.next()) {
                    Card card = new Card();
                    card.setId(rs.getString("id"));
                    card.setUser(new User(rs.getLong("user")));
                    card.setBalance(rs.getDouble("balance"));
                    card.setIsDeleted(rs.getBoolean("is_deleted"));
                    Merchant merchant = new Merchant();
                    merchant.setId(rs.getLong("m.id"));
                    merchant.setName(rs.getString("m.name"));
                    merchant.setWebsite(rs.getString("m.website"));
                    merchant.setAddress(rs.getString("m.address"));
                    merchant.setPostCode(rs.getString("m.post_code"));
                    card.setIssuedBy(merchant);
                    card.setCreatedOn(rs.getTimestamp("created_on"));
                    card.setUpdatedOn(rs.getTimestamp("updated_on"));
                    cards.add(card);
                }
                return cards;
            }, userId, limit);
        } catch (Exception e) {
            log.severe(e.getMessage());
            return null;
        }
    }

    public Card getCardById(String cardId, Long userId) {
        try {
            return jdbcTemplate.query(SQL_GET_CARD_BY_ID, (rs) -> {
                if (rs.next()) {
                    Card card = new Card();
                    card.setId(rs.getString("id"));
                    card.setUser(new User(rs.getLong("user")));
                    card.setBalance(rs.getDouble("balance"));
                    card.setIsDeleted(rs.getBoolean("is_deleted"));
                    Merchant merchant = new Merchant();
                    merchant.setId(rs.getLong("m.id"));
                    merchant.setName(rs.getString("m.name"));
                    merchant.setWebsite(rs.getString("m.website"));
                    merchant.setAddress(rs.getString("m.address"));
                    merchant.setPostCode(rs.getString("m.post_code"));
                    card.setIssuedBy(merchant);
                    card.setCreatedOn(rs.getTimestamp("created_on"));
                    card.setUpdatedOn(rs.getTimestamp("updated_on"));
                    return card;
                }
                return null;
            }, cardId, userId, userId);
        } catch (Exception e) {
            log.severe(e.getMessage());
            return null;
        }
    }

    public Card getCardByMerchantId(Long merchantId, Long userId) {
        try {
            return jdbcTemplate.query(SQL_GET_CARD_BY_MERCHANT_ID, (rs) -> {
                if (rs.next()) {
                    Card card = new Card();
                    card.setId(rs.getString("id"));
                    card.setUser(new User(rs.getLong("user")));
                    card.setBalance(rs.getDouble("balance"));
                    card.setIsDeleted(rs.getBoolean("is_deleted"));
                    Merchant merchant = new Merchant();
                    merchant.setId(rs.getLong("m.id"));
                    merchant.setName(rs.getString("m.id"));
                    merchant.setWebsite(rs.getString("m.name"));
                    merchant.setAddress(rs.getString("m.address"));
                    merchant.setPostCode(rs.getString("m.post_code"));
                    card.setIssuedBy(merchant);
                    card.setCreatedOn(rs.getTimestamp("created_on"));
                    card.setUpdatedOn(rs.getTimestamp("updated_on"));
                    return card;
                }
                return null;
            }, merchantId, userId);
        } catch (Exception e) {
            log.severe(e.getMessage());
            return null;
        }
    }

    public Integer createCard(Card card) {
        return jdbcTemplate.update(SQL_CREATE_CARD, card.getId(), card.getUser().getId(), card.getBalance(), card.getIssuedBy().getId());
    }

    public Integer addToCard(String cardId, Double amount, Long userId) {
        return jdbcTemplate.update(SQL_UPDATE_ADD_TO_CARD, amount, cardId, userId);
    }

    public Integer deductFromCard(String cardId, Double amount, Long userId) {
        return jdbcTemplate.update(SQL_UPDATE_DEDUCT_FROM_CARD, amount, cardId, userId);
    }

    public Integer deleteCard(String cardId, Long userId) {
        return jdbcTemplate.update(SQL_DELETE_CARD, cardId, userId);
    }
}
