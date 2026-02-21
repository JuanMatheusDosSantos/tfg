import { TestBed } from '@angular/core/testing';

import { Park } from './park';

describe('Park', () => {
  let service: Park;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Park);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
