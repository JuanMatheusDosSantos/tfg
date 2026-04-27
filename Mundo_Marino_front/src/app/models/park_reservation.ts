import {Park} from './park';

export interface Park_reservation {
  id: number;
  user_id: number;
  park_id: number;
  reservation_date: string;
  adults: number;
  child: number;
  status: string;
  codigo_qr: string;
  tax_id: number;
  adult_price_total: number;
  child_price_total: number;
  applied_tax: number;
  park_reservation_type_id: number;
  user?: { name: string; email: string; };
  park?: {
    name: string;
    location: string;
    opening_time: string;
  };
  type?: {
    name: string;
  };
}
