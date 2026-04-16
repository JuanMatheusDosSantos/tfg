import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewPrice } from './admin-new-price';

describe('AdminNewPrice', () => {
  let component: AdminNewPrice;
  let fixture: ComponentFixture<AdminNewPrice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNewPrice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewPrice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
