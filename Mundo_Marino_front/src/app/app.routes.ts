import { Routes } from '@angular/router';
import {Home} from './home/home';
import {Restaurant} from './views/restaurant/restaurant';
import {Park} from './views/park/park';
import {Booking} from './views/booking/booking';
import {Twitter} from './views/twitter/twitter';
import {Login} from './pages/login/login';
import {Register} from './pages/register/register';
import {MyBookings} from './views/my-bookings/my-bookings';

export const routes: Routes = [
  {path:"", component:Home},
  {path:"park", component:Park},
  {path:"restaurant", component:Restaurant},
  {path:"booking",component:Booking},
  {path:"login",component:Login},
  {path:"register",component:Register},
  {path:"myBookings",component:MyBookings},
  {path:"twitter",
    canActivate: [() => {
      window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      return false;
    }],component: Home},
  {path:"**",component:Home}
];
