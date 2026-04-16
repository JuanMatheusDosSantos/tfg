import {Component, computed, inject, signal} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {CurrencyPipe} from '@angular/common';
import {AuthService} from '../../auth/auth';
import {Router} from '@angular/router';
import {RestaurantReservationService} from '../../components/restaurant_reservation';
import {Park_reservationService} from '../../components/park_reservation';
import {ReservationPrice} from '../../models/reservation-price';
import {Tax} from '../../models/tax';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-booking',
  imports: [
    ReactiveFormsModule,
    CurrencyPipe
  ],
  templateUrl: './booking.html',
  styleUrls: [
    './booking.css'
  ],
})

export class Booking {
  park_reservation_type_id = signal(0);

  private authServices = inject(AuthService);

  errorMessage = signal('');

  bookingForm!: FormGroup;

  private bookingRestaurantService = inject(RestaurantReservationService)
  private bookingParkService = inject(Park_reservationService)
  private fb = inject(FormBuilder);
  public router = inject(Router);

  private http = inject(HttpClient);

  precios = computed(() => {
    const data = this.bookingParkService.precios()
    return Array.isArray(data) ? data : [];
  });

  public currentUser = this.authServices.currentUser;

  loading = signal<boolean>(false);

  adults = signal(1);  // ← añadir
  child = signal(0);

  taxes = signal<Tax[]>([]);

  taxActivo = computed(() => this.taxes().find(t => t.active) ?? null);

  applied_tax = computed(() => this.taxActivo()?.percentage ?? 0);
  tax_id = computed(() => this.taxActivo()?.id ?? 1);

  precioTotalConIva = computed(() =>
    Math.round(this.precioTotal() * (1 + this.applied_tax() / 100) * 100) / 100
  );

  ivaImporte = computed(() =>
    Math.round(this.precioTotal() * this.applied_tax() / 100 * 100) / 100
  );

  ngOnInit() {

    this.bookingForm = this.fb.group({
      bookingType: ['', [Validators.required]],
      adult: [1, [Validators.required, Validators.min(1)]],
      child: [0, [Validators.required]],
      date: [null],
      restaurantDate: [null, [this.customDateValidator()]],
      cardHolder: [''], // sin validators por defecto, se añaden dinámicamente
      park_reservation_type_id: [null],
    });

    // Sincronizar signals con el form
    this.bookingForm.get('adult')?.valueChanges.subscribe(v => this.adults.set(Number(v)));
    this.bookingForm.get('child')?.valueChanges.subscribe(v => this.child.set(Number(v)));

    this.bookingForm.get('park_reservation_type_id')?.valueChanges  // ← añadir aquí
      .subscribe(v => this.park_reservation_type_id.set(Number(v)));

    // Cargar precios
    this.bookingParkService.fetchPrecios().subscribe();

    this.bookingForm.get('bookingType')?.valueChanges.subscribe(type => {
      this.actualizarValidadoresPago(type);
      this.bookingForm.get('restaurantDate')?.updateValueAndValidity();
      if (type === 'park' || type === 'park_restaurant') {
        setTimeout(() => this.bookingParkService.initStripe(), 300); // ← aumenta a 300ms
      }
      this.bookingForm.get('restaurantDate')?.updateValueAndValidity();
    });
    this.bookingParkService.fetchPrecios().subscribe();

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<Tax[]>(`${environment.apiUrl}/taxes`, { headers }).subscribe({
      next: (data) => this.taxes.set(data),
    });


  }

  async onSubmit() {
    if (this.bookingForm.invalid) return;
    this.loading.set(true);
    // this.errorMessage = '';
    this.errorMessage.set("")
    const tipo = this.bookingForm.get('bookingType')?.value;

    if (tipo === 'restaurant') {
      await this.crearReservaRestaurante();
      this.router.navigate(['/myBookings']);
    } else if (tipo === 'park') {
      await this.pagarYReservarParque(false);
    } else if (tipo === 'park_restaurant') {
      await this.pagarYReservarParque(true);
      await this.crearReservaRestaurante();
      setTimeout(() => this.router.navigate(['/myBookings']), 3000);
    }
  }

  private crearReservaRestaurante(): Promise<void> {
    return new Promise((resolve, reject) => {
      const partes = this.bookingForm.get('restaurantDate')?.value.split('T');
      const fdRest = new FormData();
      fdRest.append('reservation_date', partes[0]);
      fdRest.append('reservation_hour', partes[1]);
      fdRest.append('status', 'pending');
      fdRest.append('user_id', this.currentUser()?.id.toString());
      fdRest.append('restaurant_id', '1');
      fdRest.append('party_size', (this.adults() + this.child()).toString());

      this.bookingRestaurantService.create(fdRest).subscribe({
        next: () => resolve(),
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.message || 'Error al crear la reserva de restaurante.');
          reject(err);
        }
      });
    });
  }
  protected readonly fechaMinimaPark = this.minDatePark();
  protected readonly fechaMinimaRestaurant = this.minDateRestaurant();

  private minDatePark(): string {
    const hoy = new Date();
    // Sumamos 1 día
    hoy.setDate(hoy.getDate() + 1);
    // Extraemos la parte YYYY-MM-DD
    return hoy.toISOString().split('T')[0];
  }

//esta funcion, lo que hace es que, si es parque, hace que el los datos bancarios sean obligatorios
  private actualizarValidadoresPago(type: string) {
    const control = this.bookingForm.get('cardHolder');
    if (type === 'park' || type === 'park_restaurant') {
      control?.setValidators([Validators.required, Validators.minLength(3)]);
    } else {
      control?.clearValidators();
      control?.setValue('');
    }
    control?.updateValueAndValidity();
  }

  private minDateRestaurant(): string {
    const ahora = new Date();
    // Sumamos las 2 horas de margen
    ahora.setHours(ahora.getHours() + 2);

    // Usamos el truco de la "Suecia" (sv-SE) porque formatea en ISO pero mantiene TU hora local
    // Resultado: "2026-02-22 17:46:00" -> cambiamos el espacio por 'T' y cortamos
    return ahora.toLocaleString('sv-SE', {hour12: false})
      .replace(' ', 'T')
      .slice(0, 16);
  }

  private customDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      const tipo = this.bookingForm?.get('bookingType')?.value;
      if (!valor || tipo === 'park') {
        return null;
      }

      const fechaSeleccionada = new Date(valor).getTime();
      const ahoraMasDosHoras = new Date().getTime() + (1 * 60 * 60 * 1000 + 59 * 60 * 1000);

      // Solo aplicamos el error si es Restaurante o Ambos y no cumple el tiempo
      if (fechaSeleccionada < ahoraMasDosHoras) {
        return {horaInvalida: true};
      }

      return null;
    };
  }

  precioSeleccionado = computed(() =>
    this.precios().find(p => p.park_reservation_type_id === this.park_reservation_type_id()) ?? null
  );

  precioUnitario = computed(() =>
    this.precioSeleccionado() ? Math.round(Number(this.precioSeleccionado()!.adult_price) * 100) / 100 : 0
  );

  precioNino = computed(() =>
    this.precioSeleccionado() ? Math.round(Number(this.precioSeleccionado()!.child_price) * 100) / 100 : 0
  );

  precioTotal = computed(() =>
    this.precioUnitario() * this.adults() + this.precioNino() * this.child()
  );

  async initStripe() {
    await this.bookingParkService.initStripe();
  }

  private async pagarYReservarParque(esCombinado=false) {

    if (!this.park_reservation_type_id()) {
      this.errorMessage.set( 'Por favor selecciona un tipo de entrada.');
      this.loading.set(false);
      return;
    }

    const fechaParque = this.bookingForm.get('date')?.value
      ?? this.bookingForm.get('restaurantDate')?.value?.split('T')[0];

    if (!fechaParque) {
      this.errorMessage.set('Por favor selecciona una fecha.');
      this.loading.set(false);
      return;
    }
    const totalConIva = this.precioTotal() * 1.10;
    try {
      const intent = await this.bookingParkService.crearPaymentIntent({
        amount:                   this.precioTotalConIva(),
        adults:                   this.adults(),
        child:                    this.child(),
        reservation_date:         fechaParque,
        park_id:                  1,
        park_reservation_type_id: this.park_reservation_type_id(),
        tax_id:                   this.tax_id(),
        adult_price_total:        this.precioUnitario() * this.adults(),
        child_price_total:        this.precioNino() * this.child(),
        applied_tax:              this.applied_tax(),
      });

      if (!intent) {
        this.errorMessage.set('Error al iniciar el pago.');
        this.loading.set(false);
        return;
      }

      const cardHolder = this.bookingForm.get('cardHolder')?.value;
      const result = await this.bookingParkService.confirmarPago(intent.client_secret, cardHolder);

      if (result.success) {
        if (!esCombinado) {
          setTimeout(() => this.router.navigate(['/myBookings']), 3000);
        }
      } else {
        this.errorMessage .set (result.error ?? 'Error al procesar el pago.');
        this.loading.set(false);
      }
    } catch (err: any) {
      this.errorMessage.set( err.error?.message ?? 'Error al procesar el pago.');
      this.loading.set(false);
    }
  }

}
