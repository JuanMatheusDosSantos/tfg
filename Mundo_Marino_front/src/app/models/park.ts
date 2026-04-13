import {Attraction} from './attraction';

export interface Park {
  // id?:number,
  // name?:string,
  // location?:number,
  // opening_time?:string,
  // closing_time?:string,
  id: number;
  name: string;
  location: string;
  opening_time: string;
  closing_time: string;
  attractions_count: number;
  operational_count: number;
  maintenance_count: number;
  closed_count: number;
  permanently_closed:number

  attractions: Attraction[];
}
