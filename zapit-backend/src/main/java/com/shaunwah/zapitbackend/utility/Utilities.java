package com.shaunwah.zapitbackend.utility;

import com.shaunwah.zapitbackend.model.Invoice;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.jwt.JwtDecoder;

import java.util.Date;

public final class Utilities {
    public static Long returnUserIdFromJwt(HttpServletRequest request, JwtDecoder jwtDecoder) {
        final String TOKEN = request.getHeader(HttpHeaders.AUTHORIZATION).trim().replaceFirst("Bearer\\s+", "");
        if (!TOKEN.isEmpty()) {
            return Long.parseLong(jwtDecoder.decode(TOKEN).getSubject());
        }
        return null;
    }

    public static JsonObject returnClaimInvoiceMessageInJson(String message, Long userId) {
        return Json.createObjectBuilder()
                .add("message", message)
                .add("userId", userId)
                .add("timestamp", new Date().getTime())
                .build();
    }

    public static JsonObject returnMessageInJson(String message) {
        return Json.createObjectBuilder()
                .add("message", message)
                .add("timestamp", new Date().getTime())
                .build();
    }

    public static JsonObject returnGeneratedInvoiceInJson(String message, Invoice invoice) {
        return Json.createObjectBuilder()
                .add("message", message)
                .add("invoice", invoice.getId())
                .add("t", invoice.getCreatedOn())
                .add("timestamp", new Date().getTime())
                .build();
    }
}
