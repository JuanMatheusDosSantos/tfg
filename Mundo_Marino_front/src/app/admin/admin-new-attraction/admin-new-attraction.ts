import {Component, inject, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {AdminNavbar} from '../../layouts/admin-navbar/admin-navbar';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-new-attraction',
  imports: [AdminNavbar, AdminSidebar],
  templateUrl: './admin-new-attraction.html',
  styleUrl: './admin-new-attraction.css',
})
export class AdminNewAttraction {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}`;

  guardando = signal(false);
  error = signal<string | null>(null);
  exito = signal<string | null>(null);

  name = signal('');
  type = signal('suave');
  duration = signal(1);
  max_capacity = signal(1);
  min_height = signal<number | null>(null);
  status = signal<'operational' | 'maintenance' | 'closed' | 'permanently_closed'>('operational');
  park_id = signal(1);
  imagenPreview = signal<string | null>(null);
  imagenFile = signal<File | null>(null);
  description = signal('');

  readonly DEFAULT_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFsEt5IDp4eM3zxQA_qXlmCTKvlR_kWL1l9nQ2uAotEcuvEHEggiUvGBRn8Qwx3jKLnhW2Frj7gBCi8egjueurnHnF5NkqrZJVILn4VPbo2afG-zyvZIfgsBrnRoe-MkMQjdJc5TdAsseFh8rB6HqJRlcWdDoXQTC0wFvNMSPGk-PbMcW7orrjtyDQEJqvTiaUzLAAZMGQ-4ldr4OtJZ1o3DoKPpGWdAt5NNDOocklyDyvny298A7zwtA0g4mIhwnjsWyl__BA4arG';

  protected readonly Math = Math;

  onImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.imagenFile.set(file);
    const reader = new FileReader();
    reader.onload = () => this.imagenPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  guardar() {
    if (!this.name()) {
      this.error.set('El nombre es obligatorio.');
      return;
    }

    this.guardando.set(true);
    this.exito.set(null);
    this.error.set(null);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const fd = new FormData();
    fd.append('name', this.name());
    fd.append('type', this.type());
    fd.append('duration', this.duration().toString());
    fd.append('max_capacity', this.max_capacity().toString());
    fd.append('min_height', (this.min_height() ?? 0).toString());
    fd.append('status', this.status());
    fd.append('park_id', this.park_id().toString());
    fd.append('description', this.description());
    if (this.imagenFile()) {
      fd.append('image', this.imagenFile()!);
    }

    this.http.post(`${this.apiUrl}/admin/attraction`, fd, { headers }).subscribe({
      next: () => {
        this.exito.set('Atracción creada correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/admin/park']), 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al crear la atracción');
        this.guardando.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/park']);
  }
}
