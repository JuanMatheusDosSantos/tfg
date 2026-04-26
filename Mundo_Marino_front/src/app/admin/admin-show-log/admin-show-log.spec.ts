import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShowLog } from './admin-show-log';

describe('AdminShowLog', () => {
  let component: AdminShowLog;
  let fixture: ComponentFixture<AdminShowLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminShowLog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminShowLog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
