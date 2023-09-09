package com.shaunwah.zapitbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String emailAddress;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String username;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String firstName;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String lastName;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String roles;
    @JsonIgnore
    private Boolean isDeleted;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long createdOn;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long updatedOn;

    public User(Long userId) {
        this.id = userId;
    }
}
