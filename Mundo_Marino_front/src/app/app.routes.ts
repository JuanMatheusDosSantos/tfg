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
import {AdminUsers} from './admin/admin-users/admin-users';
import {AdminUserEdit} from './admin/admin-user-edit/admin-user-edit';
import {authGuard} from './auth/auth-guard';
import {staffGuard} from './components/staff-guard';
import {parkGuard} from './components/park-guard';
import {restaurantGuard} from './components/restaurant-guard';
import {EditProfile} from './views/edit-profile/edit-profile';
import {Horario} from './views/horario/horario';
import {AdminShowLog} from './admin/admin-show-log/admin-show-log';

export const routes: Routes = [
  {path:"", component:Home},
  {path:"park", component:Park},
  {path:"restaurant", component:Restaurant},
  {path:"booking",component:Booking,canActivate:[authGuard]},
  {path:"login",component:Login},
  {path:"horario",component:Horario},
  {path:"profile",component:ProfileComponent, canActivate: [authGuard]},
  {path:"profile/edit",component:EditProfile, canActivate: [authGuard]},
  {path:"register",component:Register},
  {path:"myBookings",component:MyBookings,canActivate:[authGuard]},
  {path:"editParkBooking/:id",component:EditParkBooking,canActivate:[authGuard]},
  {path:"editRestaurantBooking/:id",component:EditRestaurantBooking,canActivate:[authGuard]},
  {path:"my-booking/park/:id",component: ShowBookingPark,canActivate:[authGuard]},
  {path:"my-booking/restaurant/:id",component: ShowBookingRestaurant,canActivate:[authGuard]},
  { path: 'attraction/:id', component: ShowAttraction },
  {path:"twitter",
    canActivate: [() => {
      window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      return false;
    }],component: Home},
  {path:"admin",component:AdminHome,canActivate:[staffGuard]},
  {path:"admin/park",component:AdminPark,canActivate:[parkGuard]},
  {path:"admin/park/new",component:AdminNewPark,canActivate:[parkGuard]},
  {path:"admin/park/:id/edit",component:AdminEditPark,canActivate:[parkGuard]},
  {path:"admin/park/bookings",component:AdminParkBookings,canActivate:[parkGuard]},
  {path:"admin/park/booking/:id/edit",component:AdminEditParkBooking,canActivate:[parkGuard]},
  {path:"admin/attraction/:id/edit",component:AdminAttractionEdit,canActivate:[parkGuard]},
  {path:"admin/prices",component:AdminPrices,canActivate:[parkGuard]},
  {path:"admin/restaurant",component:AdminRestaurant,canActivate:[adminGuard]},
  {path:"admin/attractions",component:AdminAttractions,canActivate:[parkGuard]},
  {path:"admin/attraction",component:AdminNewAttraction,canActivate:[parkGuard]},
  {path:"admin/park/booking",component:AdminNewParkBooking,canActivate:[parkGuard]},
  {path:"admin/prices/tax",component:AdminNewTax,canActivate:[parkGuard]},
  {path:"admin/prices/price",component:AdminNewPrice,canActivate:[parkGuard]},
  {path:"admin/restaurant/:id/edit",component:AdminRestaurantEdit,canActivate:[restaurantGuard]},
  {path:"admin/restaurant/bookings",component:AdminRestaurantBookings,canActivate:[restaurantGuard]},
  {path:"admin/restaurant/booking/:id/edit",component:AdminEditRestaurantBooking,canActivate:[restaurantGuard]},
  {path:"admin/logs",component:AdminLogs,canActivate:[restaurantGuard]},
  {path:"admin/log/:id",component:AdminShowLog,canActivate:[restaurantGuard]},
  {path:"admin/restaurant/new",component:AdminNewRestaurant,canActivate:[restaurantGuard]},
  {path:"admin/users",component:AdminUsers,canActivate:[adminGuard]},
  {path:"admin/user/:id/edit",component:AdminUserEdit,canActivate:[adminGuard]},
  {path:"**",component:Home}
];
