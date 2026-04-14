import { TestBed } from '@angular/core/testing';

import { AdminRestaurantBooking } from './admin-restaurant-booking';

describe('AdminRestaurantBooking', () => {
  let service: AdminRestaurantBooking;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminRestaurantBooking);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
