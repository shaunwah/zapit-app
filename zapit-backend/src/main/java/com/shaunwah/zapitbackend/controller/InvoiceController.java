package com.shaunwah.zapitbackend.controller;

import com.shaunwah.zapitbackend.model.Invoice;
import com.shaunwah.zapitbackend.model.LocationData;
import com.shaunwah.zapitbackend.service.InvoiceService;
import com.shaunwah.zapitbackend.utility.Utilities;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;

import java.awt.image.BufferedImage;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class InvoiceController {
    private final InvoiceService invoiceService;
    private final JwtDecoder jwtDecoder;

    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable String invoiceId, @RequestParam(required = false, name = "t") Long timestamp, HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.of(invoiceService.getInvoiceById(invoiceId, timestamp, JWT_USER_ID));
    }

    @GetMapping("/invoices/total")
    public ResponseEntity<Double> getInvoicesTotalByUserId(HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.ofNullable(invoiceService.getInvoicesTotalByUserId(JWT_USER_ID));
    }

    @GetMapping("/invoices")
    public ResponseEntity<List<Invoice>> getInvoicesByUserId(@RequestParam(defaultValue = "5") Integer limit, @RequestParam(defaultValue = "0") Integer offset, HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.ok(invoiceService.getInvoicesByUserId(JWT_USER_ID, limit, offset));
    }

    @GetMapping("/merchant/invoices")
    public ResponseEntity<List<Invoice>> getInvoicesByMerchantId(@RequestParam(defaultValue = "5") Integer limit, @RequestParam(defaultValue = "0") Integer offset, HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        return ResponseEntity.ok(invoiceService.getInvoicesByMerchantId(JWT_USER_ID, limit, offset));
    }

    @GetMapping("/merchant/{merchantId}/invoices")
    public ResponseEntity<List<Invoice>> getInvoicesByMerchantIdAndUserId(@PathVariable Long merchantId, @RequestParam(required = false) String exclude, @RequestParam(defaultValue = "5") Integer limit, @RequestParam(defaultValue = "0") Integer offset, HttpServletRequest request) {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder); // TODO fix this as the same as above
        return ResponseEntity.ok(invoiceService.getInvoicesByMerchantIdAndUserId(merchantId, JWT_USER_ID, exclude, limit, offset));
    }

    @PostMapping("/invoices") // TODO check if all created has httpstatus created
    public ResponseEntity<String> createInvoice(@RequestBody Invoice invoice) {
        Optional<Invoice> createdInvoice = invoiceService.createInvoice(invoice);
        if (createdInvoice.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Utilities.returnGeneratedInvoiceInJson("successfully generated invoice", createdInvoice.get()).toString());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Utilities.returnMessageInJson("an issue occured while creating an invoice").toString());
    }

    @PostMapping("/invoice/{invoiceId}")
    public ResponseEntity<String> claimInvoice(@PathVariable String invoiceId, @RequestParam(name = "t") Long timestamp, @RequestBody(required = false) LocationData locationData, HttpServletRequest request) throws Exception {
        final Long JWT_USER_ID = Utilities.returnUserIdFromJwt(request, jwtDecoder);
        Boolean result = invoiceService.claimInvoice(invoiceId, timestamp, locationData, JWT_USER_ID);
        if (result) {
            return ResponseEntity.ok(Utilities.returnClaimInvoiceMessageInJson("successfully claimed %s".formatted(invoiceId), JWT_USER_ID).toString());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Utilities.returnMessageInJson("an issue occurred while claiming %s".formatted(invoiceId)).toString());
    }
}
