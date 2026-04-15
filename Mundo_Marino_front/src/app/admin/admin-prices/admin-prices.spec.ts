import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPrices } from './admin-prices';

describe('AdminPrices', () => {
  let component: AdminPrices;
  let fixture: ComponentFixture<AdminPrices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPrices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPrices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
