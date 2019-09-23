import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveStickyHeaderComponent } from './reactive-sticky-header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ReactiveStickyHeaderComponent', () => {
  let component: ReactiveStickyHeaderComponent;
  let fixture: ComponentFixture<ReactiveStickyHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactiveStickyHeaderComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactiveStickyHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
