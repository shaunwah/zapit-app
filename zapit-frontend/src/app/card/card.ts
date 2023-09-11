import {User} from "../user/user";
import {Merchant} from "../merchant/merchant";

export interface Card {
  id: string;
  user: User;
  balance: number;
  isDeleted: boolean;
  issuedBy: Merchant;
  createdOn: string;
  updatedOn: string;
}
