package com.shaunwah.zapitbackend.model;

public record UserAuthData(String accessToken, String displayName, String avatarHash, String roles) {
}
