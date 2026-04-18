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
import {AdminRestaurantEdit} from './admin/admin-restaurant-edit/admin-restaurant-edit';
import {AdminRestaurantBookings} from './admin/admin-restaurant-bookings/admin-restaurant-bookings';
import {AdminEditRestaurantBooking} from './admin/admin-edit-restaurant-booking/admin-edit-restaurant-booking';
import {AdminPrices} from './admin/admin-prices/admin-prices';
import {AdminLogs} from './admin/admin-logs/admin-logs';
import {AdminNewAttraction} from './admin/admin-new-attraction/admin-new-attraction';
import {AdminNewParkBooking} from './admin/admin-new-park-booking/admin-new-park-booking';
import {AdminNewTax} from './admin/admin-new-tax/admin-new-tax';
import {AdminNewPrice} from './admin/admin-new-price/admin-new-price';
import {AdminNewRestaurant} from './admin/admin-new-restaurant/admin-new-restaurant';
import {AdminAttractions} from './admin/admin-attractions/admin-attractions';
import {AdminNewPark} from './admin/admin-new-park/admin-new-park';
import {AdminEditPark} from './admin/admin-edit-park/admin-edit-park';

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
  {path:"admin/park/new",component:AdminNewPark,canActivate:[adminGuard]},
  {path:"admin/park/:id/edit",component:AdminEditPark,canActivate:[adminGuard]},
  {path:"admin/park/bookings",component:AdminParkBookings,canActivate:[adminGuard]},
  {path:"admin/park/booking/:id/edit",component:AdminEditParkBooking,canActivate:[adminGuard]},
  {path:"admin/attraction/:id/edit",component:AdminAttractionEdit,canActivate:[adminGuard]},
  {path:"admin/restaurant",component:AdminRestaurant,canActivate:[adminGuard]},
  {path:"admin/restaurant/:id/edit",component:AdminRestaurantEdit,canActivate:[adminGuard]},
  {path:"admin/restaurant/bookings",component:AdminRestaurantBookings,canActivate:[adminGuard]},
  {path:"admin/restaurant/booking/:id/edit",component:AdminEditRestaurantBooking,canActivate:[adminGuard]},
  {path:"admin/prices",component:AdminPrices,canActivate:[adminGuard]},
  {path:"admin/logs",component:AdminLogs,canActivate:[adminGuard]},
  {path:"admin/attractions",component:AdminAttractions,canActivate:[adminGuard]},
  {path:"admin/attraction",component:AdminNewAttraction,canActivate:[adminGuard]},
  {path:"admin/park/booking",component:AdminNewParkBooking,canActivate:[adminGuard]},
  {path:"admin/prices/tax",component:AdminNewTax,canActivate:[adminGuard]},
  {path:"admin/prices/price",component:AdminNewPrice,canActivate:[adminGuard]},
  {path:"admin/restaurant/new",component:AdminNewRestaurant,canActivate:[adminGuard]},
  {path:"**",component:Home}
];
