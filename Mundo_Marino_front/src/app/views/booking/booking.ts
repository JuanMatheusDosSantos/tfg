import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CurrencyPipe} from '@angular/common';
import {AuthService} from '../../auth/auth';
import {Router} from '@angular/router';
import {RestaurantReservationService} from '../../components/restaurant_reservation';
import {Park_reservationService} from '../../components/park_reservation';

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
  private authServices = inject(AuthService);
  precioTotal = 0;
  errorMessage = "";
  bookingForm!: FormGroup;

  private bookingRestaurantService = inject(RestaurantReservationService)
  private bookingParkService = inject(Park_reservationService)
  private fb = inject(FormBuilder);
  public router = inject(Router);

  public currentUser = this.authServices.currentUser;

  loading: boolean = false;

  ngOnInit() {
    this.bookingForm = this.fb.group({
      bookingType: ["", [Validators.required]],
      adult: [0, [Validators.required]],
      child: [0, [Validators.required]],
      date: [[]],
      restaurantDate: [],
      currentUser: [[]],
      cardHolder: [""],
      cardNumber: [""],
      expiryDate: [""],
      cvv: [""]
    });
    this.bookingForm.get('bookingType')?.valueChanges.subscribe(type => {
      this.actualizarValidadoresPago(type);
    });
  }

  onSubmit() {
    if (this.bookingForm.invalid) return;

    this.loading = true

    const fdPark = new FormData();

    const fdRest = new FormData();

    const values = this.bookingForm.value;

    if (this.bookingForm.get("bookingType")?.value === "restaurant") {
      const partes = this.bookingForm.get('restaurantDate')?.value.split('T');

      const fecha = partes[0];
      const hora = partes[1];

      // 3. Lo añadimos al FormData con los nombres de tus columnas en BD
      fdRest.append('reservation_date', fecha);
      fdRest.append('reservation_hour', hora);
      fdRest.append('status', 'pending');
      fdRest.append("user_id", this.currentUser()?.id.toString())
      fdRest.append("restaurant_id", "1")
      let total = Number(this.bookingForm.get("adult")?.value ?? 0) + Number(this.bookingForm.get("child")?.value ?? 0);
      fdRest.append('party_size', total.toString());

      this.bookingRestaurantService.create(fdRest).subscribe({
        next: (res) => {
          console.log('¡Petición creada con éxito!', res);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          // Mostramos el mensaje de error en la UI
          this.errorMessage = err.error?.message || 'Error al crear la petición. Revisa los datos.';
          console.error('Error de Laravel:', err.error);
        }
      });
    } else if (this.bookingForm.get("bookingType")?.value === "park") {
      fdPark.append("user_id", this.currentUser()?.id.toString())
      fdPark.append("park_id", "1")
      fdPark.append("reservation_date", values.date)
      fdPark.append("adults", values.adult.toString())
      fdPark.append("child", values.adult.toString())

      this.bookingParkService.create(fdPark).subscribe({
        next: (res) => {
          console.log('¡Petición creada con éxito!', res);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          // Mostramos el mensaje de error en la UI
          this.errorMessage = err.error?.message || 'Error al crear la petición. Revisa los datos.';
          console.error('Error de Laravel:', err.error);
        }
      });

    } else {
      const partes = this.bookingForm.get('restaurantDate')?.value.split('T');

      const fecha = partes[0];
      const hora = partes[1];

      //cosas del parque
      fdPark.append("park_id", "1")
      fdPark.append("adults", values.adult.toString())
      fdPark.append("child", values.adult.toString())
      fdPark.append('status', 'pending');
      fdPark.append("user_id", this.currentUser()?.id.toString())
      fdPark.append("reservation_date", fecha)

      //cosas del restaurante
      fdRest.append('reservation_hour', hora);
      fdRest.append("restaurant_id", "1")
      fdRest.append('status', 'pending');
      fdRest.append("user_id", this.currentUser()?.id.toString())
      fdRest.append("reservation_date", fecha)

      let total = Number(this.bookingForm.get("adult")?.value ?? 0) + Number(this.bookingForm.get("child")?.value ?? 0);
      fdRest.append('party_size', total.toString());

      this.bookingParkService.create(fdPark).subscribe({
        next: (res) => {
          console.log('¡Petición creada con éxito!', res);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          // Mostramos el mensaje de error en la UI
          this.errorMessage = err.error?.message || 'Error al crear la petición. Revisa los datos.';
          console.error('Error de Laravel:', err.error);
        }
      });

      this.bookingRestaurantService.create(fdRest).subscribe({
        next: (res) => {
          console.log('¡Petición creada con éxito!', res);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          // Mostramos el mensaje de error en la UI
          this.errorMessage = err.error?.message || 'Error al crear la petición. Revisa los datos.';
          console.error('Error de Laravel:', err.error);
        }
      });

    }
  }

  protected readonly fechaMinimaPark = this.minDatePark();

  private minDatePark(): string {
    const hoy = new Date();
    // Sumamos 1 día
    hoy.setDate(hoy.getDate() + 1);
    // Extraemos la parte YYYY-MM-DD
    return hoy.toISOString().split('T')[0];
  }

//esta funcion, lo que hace es que, si es parque, hace que el los datos bancarios sean obligatorios
  private actualizarValidadoresPago(type: string) {
    const camposPago = ['cardHolder', 'cardNumber', 'expiryDate', 'cvv'];

    camposPago.forEach(nombreCampo => {
      const control = this.bookingForm.get(nombreCampo);
      if (type === 'park' || type === "park_restaurant") {
        // SI ES PARQUE: Añadimos validadores
        control?.setValidators([Validators.required]);
      } else {
        // SI NO ES PARQUE: Quitamos validadores y limpiamos el campo
        control?.clearValidators();
        control?.setValue("");
      }
      // IMPORTANTE: Decirle a Angular que re-calcule si el campo es válido
      control?.updateValueAndValidity();
    });
  }
}
