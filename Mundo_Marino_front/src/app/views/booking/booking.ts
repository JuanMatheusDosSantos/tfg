import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CurrencyPipe} from '@angular/common';
import {required} from '@angular/forms/signals';
import {AuthService} from '../../auth/auth';

@Component({
  selector: 'app-booking',
  imports: [
    ReactiveFormsModule,
    CurrencyPipe
  ],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css'],
})
export class Booking {
  private authServices = inject(AuthService);
  precioTotal = 0;
  errorMessage = "";
  bookingForm!: FormGroup;
  private fb = inject(FormBuilder);
  public currentUser = this.authServices.currentUser;

  ngOnInit() {
    this.bookingForm = this.fb.group({
      bookingType: ["", [Validators.required]],
      adult: [0, [Validators.required]],
      child: [0, [Validators.required]],
      date: [[]],
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

  }

  protected readonly fechaMinima = this.minDate();

  private minDate(): string {
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
      if (type === 'park'||type==="park_restaurant") {
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
