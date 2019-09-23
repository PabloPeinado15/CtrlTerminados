import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRegistryComponent } from './table-registry.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material';

describe('TableRegistryComponent', () => {
  let component: TableRegistryComponent;
  let fixture: ComponentFixture<TableRegistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableRegistryComponent ],
      imports: [MatTableModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
