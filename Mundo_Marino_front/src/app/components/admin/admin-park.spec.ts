import { TestBed } from '@angular/core/testing';

import { AdminParks } from './admin-parks';

describe('AdminPark', () => {
  let service: AdminParks;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminParks);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
