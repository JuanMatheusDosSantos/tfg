import {ReservationType} from './reservation-type';

export interface ReservationPrice {
  id: number;
  park_id: number;
  park_reservation_type_id: number;
  adult_price: number;
  child_price:number
  type: ReservationType;
}
