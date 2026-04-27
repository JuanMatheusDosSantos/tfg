import {Component, computed, inject, signal} from '@angular/core';
import {Park_reservationService} from '../../components/park_reservation';
import {RestaurantReservationService} from '../../components/restaurant_reservation';
import {AuthService} from '../../auth/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin} from 'rxjs';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-my-bookings',
  imports: [],
  standalone: true,
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings {
  bookingPark = inject(Park_reservationService);
  bookingRestaurant = inject(RestaurantReservationService);

  private router = inject(Router);

  public authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  allReservations = signal<any[]>([]);
  public status: string[] = [];

  filtroStatus = signal<string[]>([]);

  public cargando = signal(true);
  public isLoggedIn = this.authService.isLoggedIn;

  public currentUser: any | null = null;
  private apiUrl = `${environment.apiUrl}`;
  private imgUrl=`${environment.imgUrl}`;

public imgRest=`${this.imgUrl}/storage/bookings/restaurante_tfg.png`
  paginaActual = signal(1);
  porPagina = 3;

  ngOnInit(): void {
    this.authService.loadUserIfNeeded();
    this.authService.user$.subscribe(user => {
      this.currentUser = user ? user : null;
    });

    this.route.queryParams.subscribe(params => {
      this.cargando.set(true);

      forkJoin({
        parks: this.bookingPark.fetchPark_reservations(),
        restaurants: this.bookingRestaurant.fetchRestaurant_reservations()
      }).subscribe({
        next: (res) => {
          const parks = res.parks.map(p => ({...p, category: 'Parque'}));
          const restaurants = res.restaurants.map(r => ({...r, category: 'Restaurante'}));

          this.allReservations.set([...parks, ...restaurants].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)));

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

  // tiposTicket = ['Parque', 'Restaurante'];
  tiposTicket = computed(() =>
    [...new Set(this.allReservations().map(r => 'park_id' in r ? 'Parque' : 'Restaurante'))]
  );

  filtroTipo = signal<string[]>([]);

  toggleTipo(tipo: string) {
    this.paginaActual.set(1); // ← único cambio
    this.filtroTipo.update(current =>
      current.includes(tipo)
        ? current.filter(t => t !== tipo)
        : [...current, tipo]
    );
  }

  reservasFiltradas = computed(() => {
    const filtrosStatus = this.filtroStatus();
    const filtrosTipo = this.filtroTipo();
    const todas = this.allReservations();

    return todas.filter(r => {
      const tipo = 'park_id' in r ? 'Parque' : 'Restaurante';
      const passStatus = filtrosStatus.length === 0 || filtrosStatus.includes(r.status);
      const passTipo = filtrosTipo.length === 0 || filtrosTipo.includes(tipo);
      return passStatus && passTipo;
    });
  });

  toggleStatus(status: string) {
    this.paginaActual.set(1); // ← único cambio
    const actual = this.filtroStatus();
    if (actual.includes(status)) {
      this.filtroStatus.set(actual.filter(s => s !== status));
    } else {
      this.filtroStatus.set([...actual, status]);
    }
  }


  limpiarFiltros() {
    this.paginaActual.set(1); // ← único cambio
    this.filtroStatus.set([]);
    this.filtroTipo.set([]);
  }


  qrModal = signal<{ visible: boolean; url: string | null; reserva: any | null }>({
    visible: false,
    url: null,
    reserva: null
  });

  abrirQR(reserva: any) {
    const url = `${this.apiUrl}/reservation/${reserva.id}/qr`;
    this.qrModal.set({visible: true, url, reserva});
  }

  cerrarQR() {
    this.qrModal.set({visible: false, url: null, reserva: null});
  }

  descargarPDF(reserva: any) {

    this.http.get(`${this.apiUrl}/reservation/${reserva.id}/pdf`, {
      responseType: 'blob'

    }).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `entrada-${reserva.reservation_date.split("-").join("")}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }, error: (err) => {
        // Leer el blob del error para ver el mensaje
        const reader = new FileReader();
        reader.onload = () => console.error('Error PDF:', reader.result);
        reader.readAsText(err.error);
      }
    });
  }

  getQrUrl(id: number): string {
    return `${this.apiUrl}/reservation/${id}/qr`;
  }

  irAlDetalle(res: any) {
    if (res.category === 'Parque') {
      this.router.navigate(['my-booking/park', res.id]);
    } else {
      this.router.navigate(['my-booking/restaurant', res.id]);
    }
  }

  reservasPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.porPagina;
    return this.reservasFiltradas().slice(inicio, inicio + this.porPagina);
  });

  totalPaginas = computed(() =>
    Math.ceil(this.reservasFiltradas().length / this.porPagina)
  );

  irPagina(n: number) {
    if (n >= 1 && n <= this.totalPaginas()) {
      this.paginaActual.set(n);
    }
  }

  statusLabels: Record<string, string> = {
    paid: 'Pagado',
    pending: 'Pendiente',
    late: 'Tardío',
    cancelled: 'Cancelado',
    completed: 'Completado',
    accepted: 'Aceptado',
    no_show: 'No presentado',
    checked_in: 'En el parque'
  };

}
