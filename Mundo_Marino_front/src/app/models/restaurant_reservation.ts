import {Restaurant} from './restaurant';
import {User} from '../auth/auth.model';

export interface Restaurant_reservation {
  id?:number,
  user_id?:number,
  restaurant_id?:number,
  reservation_date?:string
  reservation_hour?:string,
  status?:string,
  party_size?:number,

  restaurant?:Restaurant,
//
//   created_at?: string;
//   updated_at?: string;


  user?:User
}
