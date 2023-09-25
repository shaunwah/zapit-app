import { CardMessageType } from './card-message-type';

export interface CardMessage {
  type: CardMessageType;
  amount: number;
  transaction?: number;
}
