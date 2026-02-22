import {Component, inject} from '@angular/core';
import {Park_reservationService} from '../../components/park_reservation';
import {RestaurantReservationService} from '../../components/restaurant_reservation';
import {AuthService} from '../../auth/auth';
import {ActivatedRoute} from '@angular/router';
import {Park_reservation} from '../../models/park_reservation';

class RestaurantReservation {
}

@Component({
  selector: 'app-my-bookings',
  imports: [],
  standalone:true,
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings {
  bookingPark = inject(Park_reservationService)
  bookingRestaurant = inject(RestaurantReservationService)

  public authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  bookingParks:Park_reservation[]=[];
  bookingRestaurants:RestaurantReservation[]=[];
  public cargando: boolean = true;
  public isLoggedIn = this.authService.isLoggedIn;

  public currentUser: any | null=null;

  ngOnInit(): void {
    this.authService.loadUserIfNeeded();
    this.authService.user$.subscribe(user => {
      this.currentUser = user ? user : null;
    });

    this.route.queryParams.subscribe(params => {
      this.cargando = true;
      this.bookingPark.fetchPark_reservations().subscribe({
        next: (data) => {
          this.bookingParks = data
          console.log(data)

          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar peticiones:', err);
          this.cargando = false;
        }
      });
    });

    this.route.queryParams.subscribe(params => {
      this.cargando = true;
      this.bookingRestaurant.fetchRestaurant_reservations().subscribe({
        next: (data) => {
          this.bookingRestaurants = data
          console.log(data)

          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar peticiones:', err);
          this.cargando = false;
        }
      });
    });
  }
}
