import {Component, computed, inject, signal} from '@angular/core';
import {Park_reservationService} from '../../components/park_reservation';
import {RestaurantReservationService} from '../../components/restaurant_reservation';
import {AuthService} from '../../auth/auth';
import {ActivatedRoute} from '@angular/router';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-my-bookings',
  imports: [],
  standalone: true,
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings {
  bookingPark = inject(Park_reservationService)
  bookingRestaurant = inject(RestaurantReservationService)

  public authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  allReservations = signal<any[]>([]);
  public status: string[] = [];

  filtroStatus = signal<string[]>([]);

  public cargando = signal(true);
  public isLoggedIn = this.authService.isLoggedIn;

  public currentUser: any | null = null;
  park = []

  ngOnInit(): void {
    this.authService.loadUserIfNeeded();
    this.authService.user$.subscribe(user => {
      this.currentUser = user ? user : null;
    });

    this.route.queryParams.subscribe(params => {
      this.cargando.set(true);

      forkJoin({
        parks: this.bookingPark.fetchPark_reservations(),
        restaurants: this.bookingRestaurant.fetchRestaurant_reservations(),
      }).subscribe({
        next: (res) => {
          const parks = res.parks.map(p => ({...p, category: 'Parque'}));
          const restaurants = res.restaurants.map(r => ({...r, category: 'Restaurante'}));

          this.allReservations.set([...parks, ...restaurants].sort((a, b) => {
            const dateA = new Date(a.reservation_date ?? 0).getTime();
            const dateB = new Date(b.reservation_date ?? 0).getTime();

            return dateB - dateA;
          }));


          this.cargando.set(false);
          this.status = [...new Set(this.allReservations().map(res => res.status).filter(s => !!s))];
        },
        error: (err) => {
          console.error('Error cargando reservas:', err);
          this.cargando.set(false);
        }
      });
    });
  }

  deletePark(id: number) {
    if (confirm("¿estas seguro de que quieres eliminar de que quieres eliminar la peticion?")) {
      this.bookingPark.delete(id).subscribe({
        error: (err) => alert('No puedes borrar esto (quizás no eres el dueño)'),
        next: () => {
          this.allReservations.update(reservas => reservas.filter(r => !(r.id === id && r.category === "Parque")))
        }
      });
    }
  }

  deleteRestaurant(id: number) {
    if (confirm("¿estas seguro de que quieres eliminar de que quieres eliminar la reserva?")) {
      this.bookingRestaurant.delete(id).subscribe({
        error: (err) => alert('No puedes borrar esto'),
        next: () => {
          this.allReservations.update(reservas => reservas.filter(r => !(r.id === id && r.category === "Restaurante")))
        }
      });
    }
  }

  reservasFiltradas = computed(() => {
    const filtros = this.filtroStatus();
    const todas = this.allReservations(); // ← llámalo como función
    if (filtros.length === 0) return todas;
    return todas.filter(r => filtros.includes(r.status));
  });

  toggleStatus(status: string) {
    const actual = this.filtroStatus();
    if (actual.includes(status)) {
      this.filtroStatus.set(actual.filter(s => s !== status));
    } else {
      this.filtroStatus.set([...actual, status]);
    }
  }

  limpiarFiltros() {
    this.filtroStatus.set([]);
  }
}
