import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewParkBooking } from './admin-new-park-booking';

describe('AdminNewParkBooking', () => {
  let component: AdminNewParkBooking;
  let fixture: ComponentFixture<AdminNewParkBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNewParkBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewParkBooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
