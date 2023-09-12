import { Card } from '../card/card';
import { LocationData } from '../shared/interfaces/location-data';

export interface Transaction {
  id?: number;
  card: Card;
  amount: number;
  status: boolean;
  location?: LocationData;
  createdOn?: number;
  updatedOn?: number;
}
