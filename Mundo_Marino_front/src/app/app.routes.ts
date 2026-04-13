import { Routes } from '@angular/router';
import {Home} from './home/home';
import {Restaurant} from './views/restaurant/restaurant';
import {Park} from './views/park/park';
import {Booking} from './views/booking/booking';
import {Twitter} from './views/twitter/twitter';
import {Login} from './pages/login/login';
import {Register} from './pages/register/register';
import {MyBookings} from './views/my-bookings/my-bookings';
import {ShowBookingPark} from './views/show-booking-park/show-booking-park';
import {ShowBookingRestaurant} from './views/show-booking-restaurant/show-booking-restaurant';
import {AdminHome} from './admin/home/admin-home';
import {adminGuard} from './components/admin-guard';
import {AdminPark} from './admin/admin-park/admin-park';
import {AdminParkBookings} from './admin/admin-park-bookings/admin-park-bookings';
import {AdminEditParkBooking} from './admin/admin-edit-park-booking/admin-edit-park-booking';
import {ShowAttraction} from './views/show-attraction/show-attraction';
import {EditParkBooking} from './views/edit-bookings/edit-park-booking';
import {EditRestaurantBooking} from './views/edit-restaurant-booking/edit-restaurant-booking';
import {ProfileComponent} from './pages/profile/profile';
import {AdminAttractionEdit} from './admin/admin-attraction-edit/admin-attraction-edit';
import {AdminRestaurant} from './admin/admin-restaurant/admin-restaurant';

export const routes: Routes = [
  {path:"", component:Home},
  {path:"park", component:Park},
  {path:"restaurant", component:Restaurant},
  {path:"booking",component:Booking},
  {path:"login",component:Login},
  {path:"profile",component:ProfileComponent},
  {path:"register",component:Register},
  {path:"myBookings",component:MyBookings},
  {path:"editParkBooking/:id",component:EditParkBooking},
  {path:"editRestaurantBooking/:id",component:EditRestaurantBooking},
  {path:"my-booking/park/:id",component: ShowBookingPark},
  {path:"my-booking/restaurant/:id",component: ShowBookingRestaurant},
  { path: 'attraction/:id', component: ShowAttraction },
  {path:"twitter",
    canActivate: [() => {
      window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      return false;
    }],component: Home},
  {path:"admin",component:AdminHome,canActivate:[adminGuard]},
  {path:"admin/park",component:AdminPark,canActivate:[adminGuard]},
  {path:"admin/park/bookings",component:AdminParkBookings,canActivate:[adminGuard]},
  {path:"admin/park/booking/:id/edit",component:AdminEditParkBooking,canActivate:[adminGuard]},
  {path:"admin/Attraction/:id/edit",component:AdminAttractionEdit,canActivate:[adminGuard]},
  {path:"admin/restaurant",component:AdminRestaurant,canActivate:[adminGuard]},
  {path:"**",component:Home}
];
