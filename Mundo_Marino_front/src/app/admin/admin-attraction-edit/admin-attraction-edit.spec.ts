import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAttractionEdit } from './admin-attraction-edit';

describe('AdminAttractionEdit', () => {
  let component: AdminAttractionEdit;
  let fixture: ComponentFixture<AdminAttractionEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAttractionEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAttractionEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
