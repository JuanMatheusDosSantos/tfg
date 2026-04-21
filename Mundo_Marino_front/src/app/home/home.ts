import {Component, inject, signal} from '@angular/core';
import {AttractionService} from '../components/attraction';
import {Attraction} from '../models/attraction';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  standalone:true,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private route = inject(Router)
  atracciones = signal<Attraction[]>([]);

  private atraccionService=inject(AttractionService)
  ngOnInit() {
    this.atraccionService.fetchAttractions().subscribe(data => {
      const vistas = new Set<string>();
      this.atracciones.set(data.filter(a => {
        if (vistas.has(a.type)) return false;
        vistas.add(a.type);
        return true;
      }));
    });
  }
  irAParque(){
    this.route.navigate(["/park"])
  }
  irAAttraccion(id:number){
    this.route.navigate([`/attraction/${id}`])
  }
}
