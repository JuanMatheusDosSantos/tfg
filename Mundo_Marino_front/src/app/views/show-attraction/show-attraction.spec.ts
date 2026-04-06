import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAttraction } from './show-attraction';

describe('ShowAttraction', () => {
  let component: ShowAttraction;
  let fixture: ComponentFixture<ShowAttraction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAttraction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAttraction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
