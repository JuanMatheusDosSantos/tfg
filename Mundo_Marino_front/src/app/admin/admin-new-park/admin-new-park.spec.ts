import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewPark } from './admin-new-park';

describe('AdminNewPark', () => {
  let component: AdminNewPark;
  let fixture: ComponentFixture<AdminNewPark>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNewPark]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewPark);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
