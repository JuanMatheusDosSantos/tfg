import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { restaurantGuard } from './restaurant-guard';

describe('restaurantGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => restaurantGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
