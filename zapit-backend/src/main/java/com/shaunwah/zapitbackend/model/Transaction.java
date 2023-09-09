package com.shaunwah.zapitbackend.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    private Long id;
    private Invoice invoice;
    private TransactionPayment paymentDetails;
    private User createdBy;
    private Long createdOn;
    private Long updatedOn;
}
