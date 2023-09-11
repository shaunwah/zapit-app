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

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class InvoiceRepository {
    private final MongoTemplate mongoTemplate;

    public Invoice getInvoiceById(String invoiceId, Long timestamp, Long userId) {
        Criteria isTimestamp = Criteria.where("createdOn").is(timestamp);
        Criteria isUserId = Criteria.where("claimedBy._id").is(userId);
        Criteria isMerchantId = Criteria.where("issuedBy.createdBy._id").is(userId);
        return mongoTemplate.findOne(new Query(Criteria.where("id").is(invoiceId).orOperator(isTimestamp, isUserId, isMerchantId)), Invoice.class, "invoices");
    }

    public Document getInvoicesTotalByUserId(Long userId) {
        Long firstDayOfTheMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay().toEpochSecond(ZoneOffset.UTC) * 1000;
        MatchOperation matchClaimedBy = Aggregation.match(Criteria.where("claimedBy._id").is(userId).and("createdOn").gte(firstDayOfTheMonth));
        GroupOperation groupByTotal = Aggregation.group("claimedBy._id").sum("total").as("t");
        Aggregation pipeline = Aggregation.newAggregation(matchClaimedBy, groupByTotal);
        return mongoTemplate.aggregate(pipeline, "invoices", Invoice.class).getRawResults();
    }

    public List<Invoice> getInvoicesByMerchantId(Long merchantId) {
        return mongoTemplate.find(new Query(Criteria.where("issuedBy._id").is(merchantId)).with(Sort.by(Sort.Direction.DESC, "createdOn")), Invoice.class, "invoices");
    }

    public List<Invoice> getInvoicesByMerchantIdAndUserId(Long merchantId, Long userId) {
        return mongoTemplate.find(new Query(Criteria.where("issuedBy._id").is(merchantId).and("claimedBy._id").is(userId)).with(Sort.by(Sort.Direction.DESC, "createdOn")), Invoice.class, "invoices");
    }

    public List<Invoice> getInvoicesByMerchantIdAndUserId(Long merchantId, Long userId, String excludeInvoiceId) {
        return mongoTemplate.find(new Query(Criteria.where("issuedBy._id").is(merchantId).and("claimedBy._id").is(userId).and("_id").ne(excludeInvoiceId)).with(Sort.by(Sort.Direction.DESC, "createdOn")), Invoice.class, "invoices");
    }

    public List<Invoice> getInvoicesByUserId(Long userId) {
        return mongoTemplate.find(
                new Query(Criteria.where("claimedBy._id").is(userId)).with(Sort.by(Sort.Direction.DESC, "createdOn"))
                , Invoice.class, "invoices");
    }

    public Invoice createInvoice(Invoice invoice) {
        return mongoTemplate.insert(invoice, "invoices");
    }

    public Boolean claimInvoice(String invoiceId, Long timestamp, Long userId) {
        Update update = new Update();
        update.set("claimedBy", new User(userId));
        return mongoTemplate.updateFirst(new Query(Criteria.where("id").is(invoiceId).and("createdOn").is(timestamp)), update, Invoice.class, "invoices").wasAcknowledged();
    }
}