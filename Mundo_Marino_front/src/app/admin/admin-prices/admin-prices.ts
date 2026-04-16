import { Component, inject, signal } from '@angular/core';
import { AdminNavbar } from '../../layouts/admin-navbar/admin-navbar';
import { AdminSidebar } from '../../layouts/admin-sidebar/admin-sidebar';
import { ReservationPrice } from '../../models/reservation-price';
import { Tax } from '../../models/tax';
import { forkJoin } from 'rxjs';
import { AdminPricesService } from '../../components/admin/admin-prices';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-prices',
  imports: [AdminNavbar, AdminSidebar, RouterLink],
  templateUrl: './admin-prices.html',
  styleUrl: './admin-prices.css',
})
export class AdminPrices {

  private service = inject(AdminPricesService);

  precios = this.service.precios;
  taxes = this.service.taxes;

  cargando = signal(true);
  error = signal<string | null>(null);

  editandoPrecioId = signal<number | null>(null);
  editandoTaxId = signal<number | null>(null);
  valorTempPrecio = signal<number>(0);
  valorTempPrecioChild = signal<number>(0);
  valorTempTax = signal<number>(0);

  ngOnInit() {
    forkJoin({
      precios: this.service.fetchPrecios(),
      taxes: this.service.fetchTaxes()
    }).subscribe({
      next: () => this.cargando.set(false),
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar datos');
        this.cargando.set(false);
      }
    });
  }

  editarPrecio(p: ReservationPrice) {
    this.editandoPrecioId.set(p.id);
    this.valorTempPrecio.set(Number(p.adult_price));
    this.valorTempPrecioChild.set(Number(p.child_price ?? 0));
  }

  cancelarPrecio() { this.editandoPrecioId.set(null); }

  guardarPrecio(p: ReservationPrice) {
    this.service.updatePrecio(p.id, this.valorTempPrecio(), this.valorTempPrecioChild()).subscribe({
      next: () => this.editandoPrecioId.set(null),
      error: (err) => this.error.set(err.error?.message ?? 'Error al guardar precio')
    });
  }

  editarTax(t: Tax) {
    this.editandoTaxId.set(t.id);
    this.valorTempTax.set(t.percentage);
  }

  cancelarTax() { this.editandoTaxId.set(null); }

  guardarTax(t: Tax) {
    this.service.updateTax(t.id, this.valorTempTax()).subscribe({
      next: () => this.editandoTaxId.set(null),
      error: (err) => this.error.set(err.error?.message ?? 'Error al guardar tax')
    });
  }

  onFechaFiltro(_fecha: string) {}

  eliminarPrecio(p: ReservationPrice) {
    if (!confirm(`¿Eliminar el precio "${p.type?.name}"?`)) return;
    this.service.deletePrecio(p.id).subscribe({
      next: () => this.precios.update(lista => lista.filter(x => x.id !== p.id)),
      error: (err) => this.error.set(err.error?.message ?? 'Error al eliminar precio')
    });
  }

  eliminarTax(t: Tax) {
    if (!confirm(`¿Eliminar el impuesto "${t.name}"?`)) return;
    this.service.deleteTax(t.id).subscribe({
      next: () => this.taxes.update(lista => lista.filter(x => x.id !== t.id)),
      error: (err) => this.error.set(err.error?.message ?? 'Error al eliminar impuesto')
    });
  }
}
