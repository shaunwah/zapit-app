package com.shaunwah.zapitbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationData {
    @JsonIgnore
    private Long id;
    private Double latitude;
    private Double longitude;

    public LocationData(Double latitude, Double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}