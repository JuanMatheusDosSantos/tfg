import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Twitter } from './twitter';

describe('Twitter', () => {
  let component: Twitter;
  let fixture: ComponentFixture<Twitter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Twitter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Twitter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
