package com.shaunwah.zapitbackend.repository;

import com.shaunwah.zapitbackend.model.LocationData;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;

@Repository
@RequiredArgsConstructor
public class LocationDataRepository {
    private final JdbcTemplate jdbcTemplate;
    private final String SQL_CREATE_LOCATION_DATA = "insert into location_data (latitude, longitude) values (?, ?)";

    public Long createLocationData(LocationData locationData) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(SQL_CREATE_LOCATION_DATA, Statement.RETURN_GENERATED_KEYS);
            ps.setDouble(1, locationData.getLatitude());
            ps.setDouble(2, locationData.getLongitude());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }
}
