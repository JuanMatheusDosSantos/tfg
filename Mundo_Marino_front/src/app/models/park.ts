import {Attraction} from './attraction';
import {User} from './user';

export interface Park {
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
  user:User;
}
