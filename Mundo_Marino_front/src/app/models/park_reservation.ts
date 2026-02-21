import {Park} from './park';

export interface Park_reservation {

  id?:number,
  user_id?:number,
  park_id?:number,
  reservation_date?:string,
  max_persons?:number,
  status?:string,

  park?:Park,
//
//   created_at?: string;
//   updated_at?: string;
}
