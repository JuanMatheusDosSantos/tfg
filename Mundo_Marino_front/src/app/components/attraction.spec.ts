import { TestBed } from '@angular/core/testing';

import { Attraction } from './attraction';

describe('Attraction', () => {
  let service: Attraction;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Attraction);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
