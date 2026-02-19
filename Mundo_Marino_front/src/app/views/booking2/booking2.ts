import {Component, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-booking',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './booking2.html',
  styleUrls: [
    './booking2.css'
  ],
})
export class Booking2 {

  pasoActual = signal(1);
  readonly totalPasos = 4;

  reservaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reservaForm = this.fb.group({
      tipo:         ['', Validators.required],
      fecha:        ['', Validators.required],
      hora:         ['', Validators.required],
      adultos:      [2, [Validators.required, Validators.min(1)]],
      ninos:        [0, Validators.min(0)],
      discapacidad: [0, Validators.min(0)],
      nombre:       ['', Validators.required],
      email:        ['', [Validators.required, Validators.email]],
      telefono:     ['', Validators.required],
      dni:          [''],
      comentarios:  [''],
      terminos:     [false, Validators.requiredTrue]
    });
  }

  get progreso(): number {
    return ((this.pasoActual() - 1) / (this.totalPasos - 1)) * 100;
  }

  get subtotal(): number {
    const v = this.reservaForm.value;
    return (v.adultos || 0) * 45 + (v.ninos || 0) * 25 + (v.discapacidad || 0) * 20;
  }

  get iva(): number {
    return this.subtotal * 0.10;
  }

  get total(): number {
    return this.subtotal + this.iva;
  }

  formatEur(valor: number): string {
    return valor.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  }

  siguiente(): void {
    if (this.pasoActual() < this.totalPasos) {
      this.pasoActual.set(this.pasoActual() + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  atras(): void {
    if (this.pasoActual() > 1) {
      this.pasoActual.set(this.pasoActual() - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  enviarReserva(): void {
    if (this.reservaForm.valid) {
      console.log('Reserva enviada:', this.reservaForm.value);
    }
  }

  stepColor(paso: number): string {
    const actual = this.pasoActual();
    if (actual > paso)  return '#22c55e';
    if (actual === paso) return '#FF7E54';
    return '#e2e8f0';
  }

  stepTextColor(paso: number): string {
    return this.pasoActual() >= paso ? '#fff' : '#64748b';
  }

  labelColor(paso: number): string {
    const actual = this.pasoActual();
    if (actual > paso)  return '#22c55e';
    if (actual === paso) return '#FF7E54';
    return '#64748b';
  }
}
