import {Component, computed, inject, signal} from '@angular/core';
import {ParkService} from '../../components/park';
import {Park} from '../../models/park';
import {RestaurantService} from '../../components/restaurant';
import {Restaurant} from '../../models/restaurant';
import {Router} from '@angular/router';

@Component({
  selector: 'app-horario',
  imports: [],
  templateUrl: './horario.html',
  styleUrl: './horario.css',
})
export class Horario {
  private parkService = inject(ParkService)
  private restaurantService=inject(RestaurantService)
  private route=inject(Router)

  park = signal<Park | null>(null);
  restaurant=signal<Restaurant | null>(null)

  ngOnInit() {
    this.parkService.fetchParks().subscribe(parks => {
      this.park.set(parks.sort((a, b) => a.id - b.id)[0] ?? null);
    });

    this.restaurantService.fetchRestaurants().subscribe(restaurants => {
      this.restaurant.set(restaurants.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))[0] ?? null);
    });

  }
  irAReservaParque() {
    this.route.navigate(['/booking'], { queryParams: { tipo: 'park' } });
  }
  irAReservaRestaurante(){
    this.route.navigate(['/booking'], { queryParams: { tipo: 'restaurant' } });
  }
}
