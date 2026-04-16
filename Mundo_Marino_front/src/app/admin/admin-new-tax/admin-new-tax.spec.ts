import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewTax } from './admin-new-tax';

describe('AdminNewTax', () => {
  let component: AdminNewTax;
  let fixture: ComponentFixture<AdminNewTax>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNewTax]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewTax);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
