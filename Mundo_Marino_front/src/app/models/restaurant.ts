import {Park} from './park';

export interface Restaurant {
  id?: number,
  name?: string,
  max_capacity?: number,
  park_id?: number,
  restaurant_id?: number,
  opening_time?: string,
  closing_time?: string,
  park?: Park
  restaurant?:Restaurant
}
