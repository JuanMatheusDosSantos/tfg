import {Park} from './park';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: number;
  role: string;
  park?:Park;
  created_at: string;
}
