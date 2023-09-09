package com.shaunwah.zapitbackend.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionPayment {
    private Long id;
    private Transaction transaction;
    private Double amount;
    private String method;
    private Boolean status;
    private User createdBy;
    private Long createdOn;
    private Long updatedOn;
}
