import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRestaurantEdit } from './admin-restaurant-edit';

describe('AdminRestaurantEdit', () => {
  let component: AdminRestaurantEdit;
  let fixture: ComponentFixture<AdminRestaurantEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRestaurantEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRestaurantEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
