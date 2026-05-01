import {Park} from './park';
import {Restaurant} from './restaurant';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: number;
  role: string;
  park?:Park;
  restaurant?:Restaurant
  created_at: string;
}
