import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBookingRestaurant } from './show-booking-restaurant';

describe('ShowBookingRestaurant', () => {
  let component: ShowBookingRestaurant;
  let fixture: ComponentFixture<ShowBookingRestaurant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowBookingRestaurant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowBookingRestaurant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
