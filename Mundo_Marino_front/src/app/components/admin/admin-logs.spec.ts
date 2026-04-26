import { TestBed } from '@angular/core/testing';

import { AdminLogs } from './admin-logs';

describe('AdminLogs', () => {
  let service: AdminLogs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminLogs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
