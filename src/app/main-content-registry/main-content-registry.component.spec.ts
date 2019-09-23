import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentRegistryComponent } from './main-content-registry.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MainContentRegistryComponent', () => {
  let component: MainContentRegistryComponent;
  let fixture: ComponentFixture<MainContentRegistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainContentRegistryComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainContentRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
