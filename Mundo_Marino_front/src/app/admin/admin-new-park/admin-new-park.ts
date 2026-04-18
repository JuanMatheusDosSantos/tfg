import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {AdminParkService} from '../../components/admin/admin-parks';

@Component({
  selector: 'app-admin-new-park',
  imports: [
    AdminSidebar
  ],
  templateUrl: './admin-new-park.html',
  styleUrl: './admin-new-park.css',
})
export class AdminNewPark {

  private service = inject(AdminParkService);
  private router = inject(Router);

  guardando = signal(false);
  error = signal<string | null>(null);
  exito = signal<string | null>(null);

  name = signal('');
  location = signal('');
  opening_time = signal('');
  closing_time = signal('');

  guardar() {
    if (!this.name()) {
      this.error.set('El nombre es obligatorio.');
      return;
    }

    this.guardando.set(true);
    this.exito.set(null);
    this.error.set(null);

    this.service.create({
      name:         this.name(),
      location:     this.location(),
      opening_time: this.opening_time(),
      closing_time: this.closing_time(),
    }).subscribe({
      next: () => {
        this.exito.set('Parque creado correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/admin/park']), 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al crear el parque');
        this.guardando.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/park']);
  }
}
