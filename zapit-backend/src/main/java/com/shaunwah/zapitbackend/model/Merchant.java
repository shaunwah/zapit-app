package com.shaunwah.zapitbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Merchant {
    private Long id;
    private String name;
    private String website;
    private String address;
    private String postCode;
    @JsonIgnore
    private Boolean isDeleted;
    private User createdBy;
    private Long createdOn;
    private Long updatedOn;
}
