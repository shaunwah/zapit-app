package com.shaunwah.zapitbackend.model;

import lombok.*;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    private Long id;
    private Card card;
    private Double amount;
    private Boolean status;
    private LocationData location;
    private Timestamp createdOn;
    private Timestamp updatedOn;
}
