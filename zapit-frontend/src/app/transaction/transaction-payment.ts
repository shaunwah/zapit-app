import {Transaction} from "./transaction";
import {User} from "../user/user";

export interface TransactionPayment {
    id: number;
    transaction: Transaction;
    amount: number;
    method: string;
    status: boolean;
    createdBy: User;
    createdOn: number;
    updatedOn: number;
}
