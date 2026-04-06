import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPark } from './admin-park';

describe('AdminPark', () => {
  let component: AdminPark;
  let fixture: ComponentFixture<AdminPark>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPark]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPark);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
