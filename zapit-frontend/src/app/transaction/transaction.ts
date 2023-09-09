import {Invoice} from "../invoice/invoice";
import {User} from "../user/user";
import {TransactionPayment} from "./transaction-payment";

export interface Transaction {
    id: number;
    invoice: Invoice;
    paymentDetails: TransactionPayment;
    createdBy: User;
    createdOn: number;
    updatedOn: number;
}
