import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditRestaurantBooking } from './admin-edit-restaurant-booking';

describe('AdminEditRestaurantBooking', () => {
  let component: AdminEditRestaurantBooking;
  let fixture: ComponentFixture<AdminEditRestaurantBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditRestaurantBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditRestaurantBooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
