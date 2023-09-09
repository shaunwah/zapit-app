package com.shaunwah.zapitbackend.service;

import com.shaunwah.zapitbackend.model.Invoice;
import com.shaunwah.zapitbackend.model.LocationData;
import com.shaunwah.zapitbackend.model.Merchant;
import com.shaunwah.zapitbackend.repository.InvoiceRepository;
import com.shaunwah.zapitbackend.repository.MerchantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final MerchantRepository merchantRepository;

    public Optional<Invoice> getInvoiceById(String invoiceId, Long timestamp, Long userId) {
        Merchant merchant = merchantRepository.getMerchantByUserId(userId);
        return Optional.ofNullable(invoiceRepository.getInvoiceById(invoiceId, timestamp, userId, merchant.getId()));
    }

    public List<Invoice> getInvoicesByMerchantId(Long userId) {
        Merchant merchant = merchantRepository.getMerchantByUserId(userId);
        return invoiceRepository.getInvoicesByMerchantId(merchant.getId());
    }

    public List<Invoice> getInvoicesByMerchantIdAndUserId(Long merchantId, Long userId) {
        return invoiceRepository.getInvoicesByMerchantIdAndUserId(merchantId, userId);
    }

    public List<Invoice> getInvoicesByMerchantIdAndUserId(Long merchantId, Long userId, String excludeInvoiceId) {
        return invoiceRepository.getInvoicesByMerchantIdAndUserId(merchantId, userId, excludeInvoiceId);
    }

    public List<Invoice> getInvoicesByUserId(Long userId) {
        return invoiceRepository.getInvoicesByUserId(userId);
    }

    public List<Document> getInvoicesByUserIdGroupedByCreatedOn(Long userId) {
        return invoiceRepository.getInvoicesByUserIdGroupedByCreatedOn(userId);
    }

    public Optional<Invoice> createInvoice(Invoice invoice) {
        invoice.setCreatedOn(new Date().getTime());
        return Optional.ofNullable(invoiceRepository.createInvoice(invoice));
    }

    public Boolean claimInvoice(String invoiceId, Long timestamp, LocationData locationData, Long userId) {
        return invoiceRepository.claimInvoice(invoiceId, timestamp, locationData, userId);
    }
}
