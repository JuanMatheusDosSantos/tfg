import {Component, inject, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {AdminNavbar} from '../../layouts/admin-navbar/admin-navbar';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-admin-new-tax',
  imports: [AdminNavbar, AdminSidebar],
  templateUrl: './admin-new-tax.html',
  styleUrl: './admin-new-tax.css',
})
export class AdminNewTax {

  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/admin`;

  guardando = signal(false);
  error = signal<string | null>(null);
  exito = signal<string | null>(null);

  name = signal('');
  percentage = signal(0);
  active = signal(true);

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  guardar() {
    if (!this.name()) {
      this.error.set('El nombre es obligatorio.');
      return;
    }

    this.guardando.set(true);
    this.exito.set(null);
    this.error.set(null);

    this.http.post(`${this.apiUrl}/tax`, {
      name:       this.name(),
      percentage: this.percentage(),
      active:     this.active(),
    }, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.exito.set('Impuesto creado correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/admin/prices']), 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al crear el impuesto');
        this.guardando.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/prices']);
  }

  onFechaFiltro(_fecha: string) {}
}
