import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentOperatorsComponent } from './main-content-operators.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../../environments/environment';
import { AngularFirestore } from 'angularfire2/firestore';

describe('MainContentOperatorsComponent', () => {
  let component: MainContentOperatorsComponent;
  let fixture: ComponentFixture<MainContentOperatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainContentOperatorsComponent ],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [AngularFirestore]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainContentOperatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
