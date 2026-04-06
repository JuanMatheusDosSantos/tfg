import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Attraction } from '../../models/attraction';

@Component({
  selector: 'app-show-attraction',
  imports: [],
  templateUrl: './show-attraction.html',
  styleUrl: './show-attraction.css',
})
export class ShowAttraction {
  atraccion = signal<Attraction | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get<Attraction>(`http://127.0.0.1:8000/api/attraction/${id}`)
      .subscribe({
        next: (data) => {
          this.atraccion.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se ha podido cargar la atracción.');
          this.loading.set(false);
        }
      });
  }

  get tipoLabel(): string {
    const map: Record<string, string> = {
      suave:    'Suave',
      moderado: 'Moderada',
      intenso:  'Intensa',
    };
    return map[this.atraccion()?.type ?? ''] ?? '';
  }

  get tipoStyle(): string {
    const map: Record<string, string> = {
      suave:    'background-color:#dcfce7;color:#15803d;',
      moderado: 'background-color:#ffedd5;color:#c2410c;',
      intenso:  'background-color:#fee2e2;color:#b91c1c;',
    };
    return map[this.atraccion()?.type ?? ''] ?? '';
  }

  get imagen(): string {
    const map: Record<string, string> = {
      suave:    'https://lh3.googleusercontent.com/aida-public/AB6AXuCFsEt5IDp4eM3zxQA_qXlmCTKvlR_kWL1l9nQ2uAotEcuvEHEggiUvGBRn8Qwx3jKLnhW2Frj7gBCi8egjueurnHnF5NkqrZJVILn4VPbo2afG-zyvZIfgsBrnRoe-MkMQjdJc5TdAsseFh8rB6HqJRlcWdDoXQTC0wFvNMSPGk-PbMcW7orrjtyDQEJqvTiaUzLAAZMGQ-4ldr4OtJZ1o3DoKPpGWdAt5NNDOocklyDyvny298A7zwtA0g4mIhwnjsWyl__BA4arG',
      moderado: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEcO_iRCG3VCuDFpcHY9phHqsZRk6ZunwMw_wee_hP7K5GCkBgViTVXMxE8mxuun1b8ZPKBdTNno8XZFyD2vQzW4aJ0dA7G7iH4nuUSLLTczHjP6qs0i1oLZ5HrL2qQx_mh62CXRMPgTQgfC2QYVk-tv6EdV0rbmeYt19mTH1gwgge7YhUNxjxVs5R1NWP_nXoYIlfAoGmQb2I0WRWr_GXDyyrAKb2ge0giJnhqyJDIfu8HFE7HNLgPjGNMEURgwHuqV3VCBAzFYsL',
      intenso:  'https://lh3.googleusercontent.com/aida-public/AB6AXuA-MT7e-6fccK5RDO2FAOUbcpJT5qiBqtwY7znPpJTBQP-eXeiTwtB0HNoR9_p_fZgWfm1-D0OIiPt6VAIzgaxE5pCzpzI9PedktsydRmPo8tfOjV_CFWcqdtcL3UtjGauo15WYAT0SiZXvar3hacQGQZgNO8CpZ5fKHwv0Upn3GEih9r8RrLJlPw0IvQeG5NmIBHkpFvuy98b_Vav2m29pMzmLgVcHbd974OnLOIumFDEXhey-kxYgXk0xQXpffjvFbwBVdks7SUdR',
    };
    return map[this.atraccion()?.type ?? ''] ?? map['suave'];
  }

  volver() {
    this.router.navigate(['/attraction']);
  }
}
