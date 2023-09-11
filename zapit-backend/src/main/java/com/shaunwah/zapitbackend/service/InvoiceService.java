package com.shaunwah.zapitbackend.service;

import com.shaunwah.zapitbackend.model.*;
import com.shaunwah.zapitbackend.repository.InvoiceRepository;
import com.shaunwah.zapitbackend.repository.MerchantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final MerchantService merchantService;
    private final CardService cardService;

    public Optional<Invoice> getInvoiceById(String invoiceId, Long timestamp, Long userId) {
        return Optional.ofNullable(invoiceRepository.getInvoiceById(invoiceId, timestamp, userId));
    }

    public Double getInvoicesTotalByUserId(Long userId) {
        Double total = ((Document) invoiceRepository.getInvoicesTotalByUserId(userId).get("results", ArrayList.class).get(0)).getDouble("t");
        if (total == null) {
            return 0.0;
        }
        return total;
    }

    public List<Invoice> getInvoicesByMerchantId(Long userId) {
        Optional<Merchant> merchant = merchantService.getMerchantByUserId(userId);
        if (merchant.isPresent()) {
            return invoiceRepository.getInvoicesByMerchantId(merchant.get().getId());
        }
        return new ArrayList<>();
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

    public Optional<Invoice> createInvoice(Invoice invoice) {
        invoice.setCreatedOn(new Date().getTime());
        return Optional.ofNullable(invoiceRepository.createInvoice(invoice));
    }

    @Transactional(rollbackFor = Exception.class)
    public Boolean claimInvoice(String invoiceId, Long timestamp, LocationData locationData, Long userId) throws Exception {
        try {
            Optional<Invoice> optInvoice = getInvoiceById(invoiceId, timestamp, userId);
            if (optInvoice.isEmpty()) {
                throw new Exception("1");
            }
            Invoice invoice = optInvoice.get();
            Optional<Card> optCard = cardService.getCardByMerchantId(invoice.getIssuedBy().getId(), userId);
            if (optCard.isEmpty()) {
                Card newCard = new Card();
                newCard.setUser(new User(userId));
                newCard.setBalance(invoice.getEligiblePoints());
                newCard.setIssuedBy(invoice.getIssuedBy());
                if (cardService.createCard(newCard, userId).isEmpty()) {
                    throw new Exception("2");
                }
            } else {
                Card card = optCard.get();
                try {
                    cardService.addToCard(card.getId(), invoice.getEligiblePoints(), userId, locationData);
                } catch (Exception e) {
                    throw new Exception("3");
                }
            }
            if (!invoiceRepository.claimInvoice(invoiceId, timestamp, userId)) {
                throw new Exception("4");
            };
            return true;
        }
        catch (Exception e) {
            log.severe(e.getMessage());
            throw new Exception("5");
        }
    }
}
