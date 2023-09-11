package com.shaunwah.zapitbackend.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.SetupIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.SetupIntentCreateParams;
import org.springframework.stereotype.Service;

@Service
public class StripeService {
    final String API_KEY = "sk_test_51NgkJqJbdv3Gv2jC5UNiDiU6I3kdKmBymgpvRngsCRDUBrmc9At1d7YIpkVDIA1iKXeWCtEQjHI6aSKSZOfVXfCK00mq0TirlI"; // TODO remove before commit

    public PaymentIntent createPaymentIntent(Long amount) throws StripeException {
        Stripe.apiKey = API_KEY;
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .addPaymentMethodType("card_present")
                .setAmount(amount)
                .setCurrency("sgd")
                .setCaptureMethod(PaymentIntentCreateParams.CaptureMethod.MANUAL)
                .build();

        return PaymentIntent.create(params);
    }
}
