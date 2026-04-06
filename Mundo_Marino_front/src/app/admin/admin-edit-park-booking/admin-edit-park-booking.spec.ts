import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditParkBooking } from './admin-edit-park-booking';

describe('AdminEditParkBooking', () => {
  let component: AdminEditParkBooking;
  let fixture: ComponentFixture<AdminEditParkBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditParkBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditParkBooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
