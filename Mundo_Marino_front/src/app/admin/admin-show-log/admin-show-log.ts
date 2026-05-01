import {Component, computed, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {AdminLogsService} from '../../components/admin/admin-logs';
import {AdminLog} from '../../models/admin-log';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-admin-show-log',
  imports: [AdminSidebar, DatePipe],
  templateUrl: './admin-show-log.html',
  styleUrl: './admin-show-log.css',
})
export class AdminShowLog {
  private service = inject(AdminLogsService);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);

  cargando = signal(true);
  error    = signal<string | null>(null);
  log      = signal<AdminLog | null>(null);

  // Parsea "name: pepe, email: a@b.com" → [{campo, valor}]
  private parseValues(raw: string): {campo: string; valor: string}[] {
    if (!raw) return [];
    return raw.split(',').map(part => {
      const idx = part.indexOf(':');
      if (idx === -1) return {campo: part.trim(), valor: ''};
      return {
        campo: part.slice(0, idx).trim(),
        valor: part.slice(idx + 1).trim(),
      };
    });
  }

  // Combina old y new en filas comparables
  diff = computed(() => {
    const l = this.log();
    if (!l) return [];

    const oldMap = new Map(this.parseValues(l.old_value).map(x => [x.campo, x.valor]));
    const newMap = new Map(this.parseValues(l.new_value).map(x => [x.campo, x.valor]));

    const campos = new Set([...oldMap.keys(), ...newMap.keys()]);

    return [...campos].map(campo => ({
      campo,
      antiguo: oldMap.get(campo) ?? '—',
      nuevo:   newMap.get(campo) ?? '—',
      cambio:  oldMap.get(campo) !== newMap.get(campo),
    }));
  });

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.service.getById(id).subscribe({
      next: (log) => {
        this.log.set(log);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se ha podido cargar el log.');
        this.cargando.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/logs']);
  }
}
