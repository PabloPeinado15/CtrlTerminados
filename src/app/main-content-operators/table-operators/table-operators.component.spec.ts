import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOperariosComponent } from './table-operators.component';
import { Observable, from, of } from 'rxjs';
import { IOrderModelTable } from '../../services/models/orders.model';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../../../environments/environment';
import { MatTableModule } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { By } from '@angular/platform-browser';

describe('TableOperariosComponent', () => {
  const dataForTableOperators: Observable<IOrderModelTable[]> = of([{
    otNumber: 12345,
    clientName: '',
    id: 'id01'
  }]);
  let component: TableOperariosComponent;
  let fixture: ComponentFixture<TableOperariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableOperariosComponent ],
      imports: [
        MatTableModule,
        AngularFireModule.initializeApp(environment.firebase),
      ],
      providers: [AngularFirestore],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableOperariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show data on each row', () => {
    dataForTableOperators.subscribe(dta => {
      component.dataSource.data = dta;
    });
    fixture.detectChanges();
    const el = fixture.debugElement.nativeElement;
    expect(el.querySelector('.prueba123').textContent).toContain('12345');
  });

});
