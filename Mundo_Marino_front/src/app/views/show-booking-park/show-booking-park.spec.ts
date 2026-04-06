import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBookingPark } from './show-booking-park';

describe('ShowBookingPark', () => {
  let component: ShowBookingPark;
  let fixture: ComponentFixture<ShowBookingPark>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowBookingPark]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowBookingPark);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
