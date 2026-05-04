import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Attraction } from '../../models/attraction';
import {environment} from '../../../environments/environment';

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
  imgUrl=`${environment.imgUrl}/storage/attractions/`

  readonly DEFAULT_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFsEt5IDp4eM3zxQA_qXlmCTKvlR_kWL1l9nQ2uAotEcuvEHEggiUvGBRn8Qwx3jKLnhW2Frj7gBCi8egjueurnHnF5NkqrZJVILn4VPbo2afG-zyvZIfgsBrnRoe-MkMQjdJc5TdAsseFh8rB6HqJRlcWdDoXQTC0wFvNMSPGk-PbMcW7orrjtyDQEJqvTiaUzLAAZMGQ-4ldr4OtJZ1o3DoKPpGWdAt5NNDOocklyDyvny298A7zwtA0g4mIhwnjsWyl__BA4arG';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get<Attraction>(`${environment.apiUrl}/attraction/${id}`)
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
    if (this.atraccion()?.image?.startsWith('http')) {
      return <string>this.atraccion()?.image;
    }
    else if(this.atraccion()?.image){
      return this.imgUrl+this.atraccion()?.image
    }
    else{
      return this.DEFAULT_IMAGE;
    }  }

  volver() {
    this.router.navigate(['/attraction']);
  }
}
