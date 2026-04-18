import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditPark } from './admin-edit-park';

describe('AdminEditPark', () => {
  let component: AdminEditPark;
  let fixture: ComponentFixture<AdminEditPark>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditPark]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditPark);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
