import {Restaurant} from './restaurant';

export interface Restaurant_reservation {
  id?:number,
  user_id?:number,
  restaurant_id?:number,
  reservation_date?:string
  time_reservation?:string,
  status?:string,
  party_size?:number,

  restaurant?:Restaurant,
//
//   created_at?: string;
//   updated_at?: string;
}
