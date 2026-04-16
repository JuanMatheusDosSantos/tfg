import {Component, inject, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {AdminNavbar} from '../../layouts/admin-navbar/admin-navbar';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {environment} from '../../../environments/environment';
import {ReservationType} from '../../models/reservation-type';

@Component({
  selector: 'app-admin-new-price',
  imports: [AdminNavbar, AdminSidebar],
  templateUrl: './admin-new-price.html',
  styleUrl: './admin-new-price.css',
})
export class AdminNewPrice {

  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/admin`;

  guardando = signal(false);
  cargando = signal(true);
  error = signal<string | null>(null);
  exito = signal<string | null>(null);

  park_reservation_type_id = signal(0);
  park_id = signal(1);
  price = signal(0);
  priceChild = signal(0);
  nuevoTipo = signal('');

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  ngOnInit() {
  }

  guardar() {
    if (!this.nuevoTipo()) {
      this.error.set('El nombre del tipo es obligatorio.');
      return;
    }
    if (this.price() <= 0) {
      this.error.set('El precio de adulto debe ser mayor que 0.');
      return;
    }

    this.guardando.set(true);
    this.exito.set(null);
    this.error.set(null);

    // Primero crea el tipo
    this.http.post(`${this.apiUrl}/park_reservation_type`,
      { name: this.nuevoTipo() },
      { headers: this.getHeaders() }
    ).subscribe({
      next: (tipo: any) => {
        // Luego crea el precio adulto
        this.http.post(`${this.apiUrl}/park_reservation_price`, {
          park_id:                  this.park_id(),
          park_reservation_type_id: tipo.id,
          price:                    this.price(),
          price_child:              this.priceChild(),
        }, { headers: this.getHeaders() }).subscribe({
          next: () => {
            this.exito.set('Precio creado correctamente.');
            this.guardando.set(false);
            setTimeout(() => this.router.navigate(['/admin/prices']), 1500);
          },
          error: (err) => {
            this.error.set(err.error?.message ?? 'Error al crear el precio');
            this.guardando.set(false);
          }
        });
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al crear el tipo');
        this.guardando.set(false);
      }
    });
  }
  crearPrecio(typeId: number) {
    this.http.post(`${this.apiUrl}/park_reservation_prices`, {
      park_id:                  this.park_id(),
      park_reservation_type_id: typeId,
      price:                    this.price(),
    }, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.exito.set('Precio creado correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/admin/prices']), 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al crear el precio');
        this.guardando.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/prices']);
  }
}
