import { Routes } from '@angular/router';
import {Home} from './home/home';
import {Restaurant} from './views/restaurant/restaurant';
import {Park} from './views/park/park';
import {Booking} from './views/booking/booking';

export const routes: Routes = [
  {path:"", component:Home},
  {path:"park", component:Park},
  {path:"restaurant", component:Restaurant},
  {path:"booking",component:Booking},
  {path:"**",component:Home}
];
