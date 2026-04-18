import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAttractions } from './admin-attractions';

describe('AdminAttractions', () => {
  let component: AdminAttractions;
  let fixture: ComponentFixture<AdminAttractions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAttractions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAttractions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
