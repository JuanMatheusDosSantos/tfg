import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewRestaurant } from './admin-new-restaurant';

describe('AdminNewRestaurant', () => {
  let component: AdminNewRestaurant;
  let fixture: ComponentFixture<AdminNewRestaurant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNewRestaurant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewRestaurant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
