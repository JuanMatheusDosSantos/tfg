import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminParkBookings } from './admin-park-bookings';

describe('AdminParkBookings', () => {
  let component: AdminParkBookings;
  let fixture: ComponentFixture<AdminParkBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminParkBookings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminParkBookings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
