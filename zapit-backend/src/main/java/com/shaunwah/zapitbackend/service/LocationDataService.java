package com.shaunwah.zapitbackend.service;

import com.shaunwah.zapitbackend.model.LocationData;
import com.shaunwah.zapitbackend.model.Merchant;
import com.shaunwah.zapitbackend.model.User;
import com.shaunwah.zapitbackend.repository.LocationDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LocationDataService {
    private final LocationDataRepository locationDataRepository;

    public Optional<LocationData> createLocationData(LocationData locationData) {
        Long locationDataId = locationDataRepository.createLocationData(locationData);
        if (locationDataId != null) {
            locationData.setId(locationDataId);
            return Optional.of(locationData);
        }
        return Optional.empty();
    }
}
