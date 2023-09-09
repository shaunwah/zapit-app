import {Merchant} from "../merchant/merchant";
import {User} from "../user/user";
import {InvoiceItem} from "./invoice-item";
import {LocationData} from "../shared/interfaces/location-data";

export interface Invoice {
    id?: string;
    identifier: string;
    invoiceItems?: InvoiceItem[];
    salesTax: number;
    additionalCharges: number;
    total?: number;
    status?: string;
    issuedBy?: Merchant;
    claimedBy?: User;
    claimedAt?: LocationData;
    createdOn?: number;
    updatedOn?: number;
}
