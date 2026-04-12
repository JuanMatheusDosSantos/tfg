import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRestaurantBooking } from './edit-restaurant-booking';

describe('EditRestaurantBooking', () => {
  let component: EditRestaurantBooking;
  let fixture: ComponentFixture<EditRestaurantBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRestaurantBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRestaurantBooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
