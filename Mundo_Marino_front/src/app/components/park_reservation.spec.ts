import { TestBed } from '@angular/core/testing';

import { Park_reservation } from './park_reservation';

describe('ParkReservation', () => {
  let service: Park_reservation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Park_reservation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
