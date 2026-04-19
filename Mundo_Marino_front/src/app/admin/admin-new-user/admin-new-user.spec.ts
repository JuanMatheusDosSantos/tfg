import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewUser } from './admin-new-user';

describe('AdminNewUser', () => {
  let component: AdminNewUser;
  let fixture: ComponentFixture<AdminNewUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNewUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
