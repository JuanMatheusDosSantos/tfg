import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminNavbar} from '../../layouts/admin-navbar/admin-navbar';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {AdminParkService} from '../../components/admin/admin-parks';


@Component({
  selector: 'app-admin-edit-park',
  imports: [],
  templateUrl: './admin-edit-park.html',
  styleUrl: './admin-edit-park.css',
})
export class AdminEditPark {
  private service = inject(AdminParkService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);
  exito = signal<string | null>(null);
  parkId = signal<number>(0);

  name = signal('');
  location = signal('');
  opening_time = signal('');
  closing_time = signal('');

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.parkId.set(id);

    this.service.getById(id).subscribe({
      next: (p) => {
        this.name.set(p.name);
        this.location.set(p.location);
        this.opening_time.set(p.opening_time.substring(0, 5));
        this.closing_time.set(p.closing_time.substring(0, 5));
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar el parque');
        this.cargando.set(false);
      }
    });
  }

  guardar() {
    if (!this.name()) {
      this.error.set('El nombre es obligatorio.');
      return;
    }

    this.guardando.set(true);
    this.exito.set(null);
    this.error.set(null);

    this.service.update(this.parkId(), {
      name:         this.name(),
      location:     this.location(),
      opening_time: this.opening_time(),
      closing_time: this.closing_time(),
    }).subscribe({
      next: () => {
        this.exito.set('Parque actualizado correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/admin/park']), 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al actualizar el parque');
        this.guardando.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/park']);
  }
}
