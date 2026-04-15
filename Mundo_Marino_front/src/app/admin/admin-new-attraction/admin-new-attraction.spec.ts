import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewAttraction } from './admin-new-attraction';

describe('AdminNewAttraction', () => {
  let component: AdminNewAttraction;
  let fixture: ComponentFixture<AdminNewAttraction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNewAttraction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewAttraction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
