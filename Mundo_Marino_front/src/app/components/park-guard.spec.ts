import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { parkGuard } from './park-guard';

describe('parkGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => parkGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
