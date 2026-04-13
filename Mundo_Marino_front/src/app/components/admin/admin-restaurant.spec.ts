import { TestBed } from '@angular/core/testing';

import { AdminRestaurant } from './admin-restaurant';

describe('AdminRestaurant', () => {
  let service: AdminRestaurant;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminRestaurant);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
