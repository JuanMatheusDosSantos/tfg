import {Park} from './park';

export interface Attraction {
  id?:number,
  name?:string,
  type?:string,
  duration?:number,
  max_capacity?:number,
  park_id?:number,

  park?:Park
}
