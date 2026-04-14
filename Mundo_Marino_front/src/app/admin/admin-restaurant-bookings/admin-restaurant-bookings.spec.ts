import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRestaurantBookings } from './admin-restaurant-bookings';

describe('AdminRestaurantBookings', () => {
  let component: AdminRestaurantBookings;
  let fixture: ComponentFixture<AdminRestaurantBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRestaurantBookings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRestaurantBookings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
