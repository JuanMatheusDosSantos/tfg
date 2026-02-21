import { TestBed } from '@angular/core/testing';

import { RestaurantReservation } from './restaurant_reservation';

describe('RestaurantReservation', () => {
  let service: RestaurantReservation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantReservation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
