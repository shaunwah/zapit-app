package com.shaunwah.zapitbackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Card {
    private String id;
    private User user;
    private Double balance;
    private Boolean isDeleted;
    private Merchant issuedBy;
    private Timestamp createdOn;
    private Timestamp updatedOn;

    public Card(String cardId) { this.id = cardId; }
}
