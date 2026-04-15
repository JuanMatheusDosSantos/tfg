import { TestBed } from '@angular/core/testing';

import { AdminPrices } from './admin-prices';

describe('AdminPrices', () => {
  let service: AdminPrices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPrices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
