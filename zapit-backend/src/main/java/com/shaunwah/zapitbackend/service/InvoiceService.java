package com.shaunwah.zapitbackend.service;

import com.shaunwah.zapitbackend.config.ZapitException;
import com.shaunwah.zapitbackend.model.*;
import com.shaunwah.zapitbackend.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        try {
            Double total = ((Document) invoiceRepository.getInvoicesTotalByUserId(userId).get("results", ArrayList.class).get(0)).getDouble("t");
            if (total == null) {
                return 0.0;
            }
            return total;
        } catch (Exception e) {
            log.severe(e.getMessage());
            return 0.0;
        }

    }

    public List<Invoice> getInvoicesByMerchantId(Long userId, Integer limit, Integer offset) {
        Optional<Merchant> merchant = merchantService.getMerchantByUserId(userId);
        if (merchant.isPresent()) {
            return invoiceRepository.getInvoicesByMerchantId(merchant.get().getId(), limit, offset);
        }
        return new ArrayList<>();
    }

    public List<Invoice> getInvoicesByMerchantIdAndUserId(Long merchantId, Long userId, Integer limit, Integer offset) {
        return invoiceRepository.getInvoicesByMerchantIdAndUserId(merchantId, userId, limit, offset);
    }

    public List<Invoice> getInvoicesByMerchantIdAndUserId(Long merchantId, Long userId, String excludeInvoiceId, Integer limit, Integer offset) {
        return invoiceRepository.getInvoicesByMerchantIdAndUserId(merchantId, userId, excludeInvoiceId, limit, offset);
    }

    public List<Invoice> getInvoicesByUserId(Long userId, Integer limit, Integer offset) {
        return invoiceRepository.getInvoicesByUserId(userId, limit, offset);
    }

    public Optional<Invoice> createInvoice(Invoice invoice) {
        invoice.setCreatedOn(new Date().getTime());
        return Optional.ofNullable(invoiceRepository.createInvoice(invoice));
    }

    @Transactional(rollbackFor = ZapitException.class)
    public Boolean claimInvoice(String invoiceId, Long timestamp, LocationData locationData, Long userId) throws Exception {
        try {

            // verifies if the invoice exists
            Optional<Invoice> optInvoice = getInvoiceById(invoiceId, timestamp, userId);
            if (optInvoice.isEmpty()) {
                throw new ZapitException();
            }
            Invoice invoice = optInvoice.get();

            // verifies if the user has an existing card
            Optional<Card> optCard = cardService.getCardByMerchantId(invoice.getIssuedBy().getId(), userId);
            if (optCard.isEmpty()) {

                // creates a new card if the user does not have an existing one
                Card newCard = new Card();
                newCard.setUser(new User(userId));
                newCard.setBalance(invoice.getEligiblePoints());
                newCard.setIssuedBy(invoice.getIssuedBy());
                if (cardService.createCard(newCard, userId, locationData).isEmpty()) {
                    throw new ZapitException();
                }
            } else {

                // adds points to the user's existing card
                Card card = optCard.get();
                try {
                    cardService.addToCard(card.getId(), invoice.getEligiblePoints(), userId, locationData);
                } catch (Exception e) {
                    throw new ZapitException();
                }
            }

            // claims the invoice
            if (!invoiceRepository.claimInvoice(invoiceId, timestamp, userId)) {
                throw new ZapitException();
            }
            return true;
        }
        catch (Exception e) {
            log.severe(e.getMessage());
            throw new ZapitException();
        }
    }
}
