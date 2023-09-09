package com.shaunwah.zapitbackend.repository;

import com.shaunwah.zapitbackend.model.Invoice;
import com.shaunwah.zapitbackend.model.LocationData;
import com.shaunwah.zapitbackend.model.User;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class InvoiceRepository {
    private final MongoTemplate mongoTemplate;

    public Invoice getInvoiceById(String invoiceId, Long timestamp, Long userId, Long merchantId) {
        Criteria isTimestamp = Criteria.where("createdOn").is(timestamp);
        Criteria isUserId = Criteria.where("claimedBy.id").is(userId);
        Criteria isMerchantId = Criteria.where("issuedBy.id").is(merchantId);
        return mongoTemplate.findOne(new Query(Criteria.where("id").is(invoiceId).orOperator(isTimestamp, isUserId, isMerchantId)), Invoice.class, "invoices");
    }

    public List<Invoice> getInvoicesByMerchantId(Long merchantId) {
        return mongoTemplate.find(new Query(Criteria.where("issuedBy.id").is(merchantId)).with(Sort.by(Sort.Direction.DESC, "createdOn")), Invoice.class, "invoices");
    }

    public List<Invoice> getInvoicesByMerchantIdAndUserId(Long merchantId, Long userId) {
        return mongoTemplate.find(new Query(Criteria.where("issuedBy.id").is(merchantId).and("claimedBy.id").is(userId)).with(Sort.by(Sort.Direction.DESC, "createdOn")), Invoice.class, "invoices");
    }

    public List<Invoice> getInvoicesByMerchantIdAndUserId(Long merchantId, Long userId, String excludeInvoiceId) {
        return mongoTemplate.find(new Query(Criteria.where("issuedBy.id").is(merchantId).and("claimedBy.id").is(userId).and("_id").ne(excludeInvoiceId)).with(Sort.by(Sort.Direction.DESC, "createdOn")), Invoice.class, "invoices");
    }

    public List<Invoice> getInvoicesByUserId(Long userId) {
        return mongoTemplate.find(
                new Query(Criteria.where("claimedBy.id").is(userId)).with(Sort.by(Sort.Direction.DESC, "createdOn"))
                , Invoice.class, "invoices");
    }

    public List<Document> getInvoicesByUserIdGroupedByCreatedOn(Long userId) {
        MatchOperation matchClaimedBy = Aggregation.match(Criteria.where("claimedBy.id").is(userId));
        GroupOperation groupByCreatedOn = Aggregation.group("createdOnFormatted").push(Aggregation.ROOT).as("invoices");
        Aggregation pipeline = Aggregation.newAggregation(matchClaimedBy, groupByCreatedOn);
        return mongoTemplate.aggregate(pipeline, "invoices", Document.class).getMappedResults();
    }

    public Invoice createInvoice(Invoice invoice) {
        return mongoTemplate.insert(invoice, "invoices");
    }

    public Boolean claimInvoice(String invoiceId, Long timestamp, LocationData locationData, Long userId) {
        Update update = new Update();
        update.set("claimedBy", new User(userId));
        update.set("claimedAt", locationData);
        return mongoTemplate.updateFirst(new Query(Criteria.where("_id").is(invoiceId).and("createdOn").is(timestamp)), update, Invoice.class, "invoices").wasAcknowledged();
    }
}
