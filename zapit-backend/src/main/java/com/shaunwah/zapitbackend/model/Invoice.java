package com.shaunwah.zapitbackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    private String id;
    private String identifier;
    private List<InvoiceItem> invoiceItems;
    private Double salesTax;
    private Double additionalCharges;
    private Double total;
    private Double eligiblePoints;
    private String status;
    private Merchant issuedBy;
    private User claimedBy;
    private Long claimedOn;
    private Long createdOn;
    private Long updatedOn;
}
