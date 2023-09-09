package com.shaunwah.zapitbackend.service;

import com.shaunwah.zapitbackend.model.Merchant;
import com.shaunwah.zapitbackend.model.User;
import com.shaunwah.zapitbackend.repository.MerchantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MerchantService {
    private final MerchantRepository merchantRepository;

    public Optional<Merchant> getMerchantById(Long merchantId) {
        return Optional.ofNullable(merchantRepository.getMerchantById(merchantId));
    }

    public Optional<Merchant> getMerchantByUserId(Long userId) {
        return Optional.ofNullable(merchantRepository.getMerchantByUserId(userId));
    }

    public Optional<Merchant> createMerchant(Merchant merchant, Long userId) {
        merchant.setCreatedBy(new User(userId));
        Long merchantId = merchantRepository.createMerchant(merchant);
        if (merchantId != null) {
            merchant.setId(merchantId);
            return Optional.of(merchant);
        }
        return Optional.empty();
    }

    public Boolean updateMerchant(Merchant merchant) {
        return merchantRepository.updateMerchant(merchant) > 0;
    }

    public Boolean deleteMerchant(Long merchantId) {
        return merchantRepository.deleteMerchant(merchantId) > 0;
    }
}
