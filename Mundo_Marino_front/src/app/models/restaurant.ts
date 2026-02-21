import {Park} from './park';

export interface Restaurant {
  id?:number,
  name?:string,
  max_capacity?:number,
  park_id?:number,

  park?:Park

}
