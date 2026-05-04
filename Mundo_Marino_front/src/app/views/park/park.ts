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
imgUrl=`${environment.imgUrl}/storage/atracctions/`

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

  // imagenPorTipo(tipo: string): string {
  //   const map: Record<string, string> = {
  //     suave:    'https://lh3.googleusercontent.com/aida-public/AB6AXuCFsEt5IDp4eM3zxQA_qXlmCTKvlR_kWL1l9nQ2uAotEcuvEHEggiUvGBRn8Qwx3jKLnhW2Frj7gBCi8egjueurnHnF5NkqrZJVILn4VPbo2afG-zyvZIfgsBrnRoe-MkMQjdJc5TdAsseFh8rB6HqJRlcWdDoXQTC0wFvNMSPGk-PbMcW7orrjtyDQEJqvTiaUzLAAZMGQ-4ldr4OtJZ1o3DoKPpGWdAt5NNDOocklyDyvny298A7zwtA0g4mIhwnjsWyl__BA4arG',
  //     moderado: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEcO_iRCG3VCuDFpcHY9phHqsZRk6ZunwMw_wee_hP7K5GCkBgViTVXMxE8mxuun1b8ZPKBdTNno8XZFyD2vQzW4aJ0dA7G7iH4nuUSLLTczHjP6qs0i1oLZ5HrL2qQx_mh62CXRMPgTQgfC2QYVk-tv6EdV0rbmeYt19mTH1gwgge7YhUNxjxVs5R1NWP_nXoYIlfAoGmQb2I0WRWr_GXDyyrAKb2ge0giJnhqyJDIfu8HFE7HNLgPjGNMEURgwHuqV3VCBAzFYsL',
  //     intenso:  'https://lh3.googleusercontent.com/aida-public/AB6AXuA-MT7e-6fccK5RDO2FAOUbcpJT5qiBqtwY7znPpJTBQP-eXeiTwtB0HNoR9_p_fZgWfm1-D0OIiPt6VAIzgaxE5pCzpzI9PedktsydRmPo8tfOjV_CFWcqdtcL3UtjGauo15WYAT0SiZXvar3hacQGQZgNO8CpZ5fKHwv0Upn3GEih9r8RrLJlPw0IvQeG5NmIBHkpFvuy98b_Vav2m29pMzmLgVcHbd974OnLOIumFDEXhey-kxYgXk0xQXpffjvFbwBVdks7SUdR',
  //   };
  //   return map[tipo] ?? map['suave'];
  // }

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

