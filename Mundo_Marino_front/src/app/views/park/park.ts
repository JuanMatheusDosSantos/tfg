import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttractionService } from '../../components/attraction';
import { Attraction } from '../../models/attraction';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-park',
  imports: [],
  templateUrl: './park.html',
  styleUrl: './park.css',
})
export class Park {

  private attractionService = inject(AttractionService);
  private router = inject(Router);

  atracciones = signal<Attraction[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  filtroTipo = signal<string[]>([]);
  filtroAltura = signal<number[]>([]);

  paginaActual = signal(1);
  readonly porPagina = 5;
imgUrl=`${environment.imgUrl}/storage/attractions/`

  readonly DEFAULT_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFsEt5IDp4eM3zxQA_qXlmCTKvlR_kWL1l9nQ2uAotEcuvEHEggiUvGBRn8Qwx3jKLnhW2Frj7gBCi8egjueurnHnF5NkqrZJVILn4VPbo2afG-zyvZIfgsBrnRoe-MkMQjdJc5TdAsseFh8rB6HqJRlcWdDoXQTC0wFvNMSPGk-PbMcW7orrjtyDQEJqvTiaUzLAAZMGQ-4ldr4OtJZ1o3DoKPpGWdAt5NNDOocklyDyvny298A7zwtA0g4mIhwnjsWyl__BA4arG';

  ngOnInit() {
    this.attractionService.fetchAttractions().subscribe({
      next: (data) => {
        this.atracciones.set(data.filter(a => a.status !== 'permanently_closed'&&a.park?.id===1));
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las atracciones.');
        console.log(err.message)
        this.cargando.set(false);
      }
    });
  }

  atraccionesFiltradas = computed(() => {
    let lista = this.atracciones();

    const tipos = this.filtroTipo();
    if (tipos.length > 0) {
      lista = lista.filter(a => tipos.includes(a.type));
    }

    const alturas = this.filtroAltura();
    if (alturas.length > 0) {
      lista = lista.filter(a => {
        const altura = a.min_height === null || a.min_height === undefined ? 0 : Number(a.min_height);
        return alturas.includes(altura);
      });
    }

    return lista;
  });

  toggleTipo(tipo: string) {
    this.filtroTipo.update(current =>
      current.includes(tipo)
        ? current.filter(t => t !== tipo)
        : [...current, tipo]
    );
    this.paginaActual.set(1);
  }

  toggleAltura(altura: number) {
    this.filtroAltura.update(current =>
      current.includes(altura)
        ? current.filter(h => h !== altura)
        : [...current, altura]
    );
    this.paginaActual.set(1);
  }

  limpiarFiltros() {
    this.filtroTipo.set([]);
    this.filtroAltura.set([]);
  }

  verDetalle(id: number) {
    this.router.navigate(['/attraction', id]);
  }

  // Alturas únicas disponibles en las atracciones cargadas
  alturasDisponibles = computed(() => {
    const alturas = this.atracciones()
      .map(a => a.min_height !== null && a.min_height !== undefined ? Number(a.min_height) : null)
      .filter((h): h is number => h !== null && h > 0);
    return [...new Set(alturas)].sort((a, b) => a - b);
  });

  tipoClass(tipo: string): string {
    const map: Record<string, string> = {
      suave:    'background-color:#dcfce7;color:#15803d;',
      moderado: 'background-color:#ffedd5;color:#c2410c;',
      intenso:  'background-color:#fee2e2;color:#b91c1c;',
    };
    return map[tipo] ?? '';
  }

  tipoLabel(tipo: string): string {
    const map: Record<string, string> = {
      suave:    'SUAVE',
      moderado: 'MODERADA',
      intenso:  'INTENSA',
    };
    return map[tipo] ?? tipo.toUpperCase();
  }

  imagenAtraccion(a: Attraction): string {
    return this.imgUrl+a.image || this.DEFAULT_IMAGE;
  }

  descripcionPorTipo(tipo: string): string {
    const map: Record<string, string> = {
      suave:    'Perfecta para familias y niños. Diversión garantizada para los más pequeños.',
      moderado: 'Una experiencia envolvente con algo de emoción para toda la familia.',
      intenso:  'Solo para los amantes de las emociones fuertes. ¡Adrenalina pura!',
    };
    return map[tipo] ?? '';
  }
  atraccionesPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.porPagina;
    return this.atraccionesFiltradas().slice(inicio, inicio + this.porPagina);
  });

  totalPaginas = computed(() =>
    Math.ceil(this.atraccionesFiltradas().length / this.porPagina)
  );

  irPagina(pagina: number) {
    this.paginaActual.set(pagina);
  }
}

