import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditParkBooking } from './edit-park-booking';

describe('EditBookings', () => {
  let component: EditParkBooking;
  let fixture: ComponentFixture<EditParkBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditParkBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditParkBooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
