// import {Component, inject, signal} from '@angular/core';
// import {HttpClient, HttpHeaders} from '@angular/common/http';
// import {ActivatedRoute, Router} from '@angular/router';
// import {environment} from '../../../environments/environment';
// import {Attraction} from '../../models/attraction';
// import {FormsModule} from '@angular/forms';
//
//
// @Component({
//   selector: 'app-admin-attraction-edit',
//   imports: [FormsModule],
//   templateUrl: './admin-attraction-edit.html',
//   styleUrl: './admin-attraction-edit.css',
// })
// export class AdminAttractionEdit {
//   private http = inject(HttpClient);
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   private apiUrl = `${environment.apiUrl}`;
//
//   cargando = signal(true);
//   guardando = signal(false);
//   error = signal<string | null>(null);
//   exito = signal<string | null>(null);
//   reserva = signal<Attraction | null>(null);
//
//   name = signal('');
//   type = signal('suave');
//   duration = signal(1);
//   max_capacity = signal(1);
//   min_height = signal<number | null>(null);
//   status = signal<'operational' | 'maintenance' | 'closed' | 'permanently_closed'>('operational');
//   park_id = signal(1);
//
//   protected readonly Math = Math;
//
//   ngOnInit() {
//     const id = this.route.snapshot.paramMap.get('id');
//     const token = localStorage.getItem('token');
//     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
//
//     this.http.get<Attraction>(`${this.apiUrl}/admin/atraccion/${id}`, { headers }).subscribe({
//       next: (a) => {
//         this.reserva.set(a);
//         this.name.set(a.name ?? '');
//         this.type.set(a.type ?? 'suave');
//         this.duration.set(a.duration ?? 1);
//         this.max_capacity.set(a.max_capacity ?? 1);
//         this.min_height.set(a.min_height ?? null);
//         this.status.set(a.status ?? 'operational');
//         this.park_id.set(a.park?.id ?? 1);
//         this.cargando.set(false);
//       },
//       error: (err) => {
//         this.error.set(err.error?.message ?? 'Error al cargar la atracción');
//         this.cargando.set(false);
//       }
//     });
//   }
//
//   guardar() {
//     this.guardando.set(true);
//     this.exito.set(null);
//     this.error.set(null);
//
//     const token = localStorage.getItem('token');
//     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
//     const id = this.reserva()?.id;
//
//     const body = {
//       name: this.name(),
//       type: this.type(),
//       duration: this.duration(),
//       max_capacity: this.max_capacity(),
//       min_height: this.min_height(),
//       status: this.status(),
//       park_id: this.park_id(),
//     };
//
//     this.http.put(`${this.apiUrl}/admin/attraction/${id}`, body, { headers }).subscribe({
//       next: () => {
//         this.exito.set('Atracción actualizada correctamente.');
//         this.guardando.set(false);
//         setTimeout(() => this.router.navigate(['/admin/attractions']), 1500);
//       },
//       error: (err) => {
//         this.error.set(err.error?.message ?? 'Error al guardar la atracción');
//         this.guardando.set(false);
//       }
//     });
//   }
//
//   volver() {
//     this.router.navigate(['/admin/attractions']);
//   }
// }

import {Component, inject, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {Attraction} from '../../models/attraction';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-admin-attraction-edit',
  imports: [FormsModule],
  templateUrl: './admin-attraction-edit.html',
  styleUrl: './admin-attraction-edit.css',
})
export class AdminAttractionEdit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}`;

  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);
  exito = signal<string | null>(null);
  reserva = signal<Attraction | null>(null);

  name = signal('');
  type = signal('suave');
  duration = signal(1);
  max_capacity = signal(1);
  min_height = signal<number | null>(null);
  status = signal<'operational' | 'maintenance' | 'closed' | 'permanently_closed'>('operational');
  park_id = signal(1);
  imagenPreview = signal<string | null>(null);
  imagenFile = signal<File | null>(null);

  readonly DEFAULT_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFsEt5IDp4eM3zxQA_qXlmCTKvlR_kWL1l9nQ2uAotEcuvEHEggiUvGBRn8Qwx3jKLnhW2Frj7gBCi8egjueurnHnF5NkqrZJVILn4VPbo2afG-zyvZIfgsBrnRoe-MkMQjdJc5TdAsseFh8rB6HqJRlcWdDoXQTC0wFvNMSPGk-PbMcW7orrjtyDQEJqvTiaUzLAAZMGQ-4ldr4OtJZ1o3DoKPpGWdAt5NNDOocklyDyvny298A7zwtA0g4mIhwnjsWyl__BA4arG';

  protected readonly Math = Math;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<Attraction>(`${this.apiUrl}/admin/atraccion/${id}`, { headers }).subscribe({
      next: (a) => {
        this.reserva.set(a);
        this.name.set(a.name ?? '');
        this.type.set(a.type ?? 'suave');
        this.duration.set(a.duration ?? 1);
        this.max_capacity.set(a.max_capacity ?? 1);
        this.min_height.set(a.min_height ?? null);
        this.status.set(a.status ?? 'operational');
        this.park_id.set(a.park?.id ?? 1);
        this.imagenPreview.set(a.image ?? this.DEFAULT_IMAGE);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar la atracción');
        this.cargando.set(false);
      }
    });
  }

  onImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.imagenFile.set(file);
    const reader = new FileReader();
    reader.onload = () => this.imagenPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  guardar() {
    this.guardando.set(true);
    this.exito.set(null);
    this.error.set(null);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const id = this.reserva()?.id;

    const fd = new FormData();
    fd.append('name', this.name());
    fd.append('type', this.type());
    fd.append('duration', this.duration().toString());
    fd.append('max_capacity', this.max_capacity().toString());
    fd.append('min_height', (this.min_height() ?? 0).toString());
    fd.append('status', this.status());
    fd.append('park_id', this.park_id().toString());
    fd.append('_method', 'PUT');
    if (this.imagenFile()) {
      fd.append('image', this.imagenFile()!);
    }

    this.http.post(`${this.apiUrl}/admin/attraction/${id}`, fd, { headers }).subscribe({
      next: () => {
        this.exito.set('Atracción actualizada correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/admin/attractions']), 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al guardar la atracción');
        this.guardando.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/attractions']);
  }
}
