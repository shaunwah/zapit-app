package com.shaunwah.zapitbackend.service;

import com.shaunwah.zapitbackend.config.ZapitException;
import com.shaunwah.zapitbackend.model.Merchant;
import com.shaunwah.zapitbackend.model.User;
import com.shaunwah.zapitbackend.repository.MerchantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log
public class MerchantService {
    private final MerchantRepository merchantRepository;
    private final UserService userService;

    public Optional<Merchant> getMerchantById(Long merchantId) {
        return Optional.ofNullable(merchantRepository.getMerchantById(merchantId));
    }

    public Optional<Merchant> getMerchantByUserId(Long userId) {
        return Optional.ofNullable(merchantRepository.getMerchantByUserId(userId));
    }

    @Transactional(rollbackFor = ZapitException.class)
    public Optional<Merchant> createMerchant(Merchant merchant, Long userId) throws Exception {
        try {
            merchant.setCreatedBy(new User(userId));
            Long merchantId = merchantRepository.createMerchant(merchant);
            if (merchantId != null) {
                merchant.setId(merchantId);
                if (!userService.updateUserRolesById("ROLE_MERCHANT", userId)) {
                    throw new ZapitException();
                }
                return Optional.of(merchant);
            }
        } catch (Exception e) {
            log.severe(e.getMessage());
            throw new ZapitException();
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
