package com.shaunwah.zapitbackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceItem {
    private String identifier;
    private String name;
    private Integer quantity;
    private Double unitPrice;
}
