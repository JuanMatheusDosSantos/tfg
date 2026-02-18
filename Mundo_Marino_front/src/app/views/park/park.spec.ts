import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Park } from './park';

describe('Park', () => {
  let component: Park;
  let fixture: ComponentFixture<Park>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Park]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Park);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
