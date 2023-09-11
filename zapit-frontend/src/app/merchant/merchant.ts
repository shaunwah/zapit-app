import {User} from "../user/user";

export interface Merchant {
    id: number;
    name: string;
    website: string;
    address: string;
    postCode: string;
    isDeleted: boolean;
    createdBy: User;
    createdOn: string;
    updatedOn: string;
}
