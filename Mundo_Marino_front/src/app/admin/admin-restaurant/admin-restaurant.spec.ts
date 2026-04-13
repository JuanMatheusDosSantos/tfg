import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRestaurant } from './admin-restaurant';

describe('AdminRestaurant', () => {
  let component: AdminRestaurant;
  let fixture: ComponentFixture<AdminRestaurant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRestaurant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRestaurant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
