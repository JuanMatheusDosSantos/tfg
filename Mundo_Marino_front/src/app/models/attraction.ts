import {Park} from './park';

export interface Attraction {
  // id?:number,
  // name?:string,
  // type?:string,
  // duration?:number,
  // max_capacity?:number,
  // park_id?:number,


  id: number;
  name: string;
  type: string;
  duration: number;
  description:string;
  max_capacity: number;
  status: 'operational' | 'maintenance' | 'closed' | 'permanently_closed';
  min_height: number;
  image?: string;
  park?: Park
}
