import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentAdministratorsPanelComponent } from './main-content-administrators.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MainContentAdministratorsPanelComponent', () => {
  let component: MainContentAdministratorsPanelComponent;
  let fixture: ComponentFixture<MainContentAdministratorsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainContentAdministratorsPanelComponent ],
      imports: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainContentAdministratorsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
