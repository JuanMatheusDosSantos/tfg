import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Booking2 } from './booking2';

describe('Booking', () => {
  let component: Booking2;
  let fixture: ComponentFixture<Booking2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Booking2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Booking2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
