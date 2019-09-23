import { TestBed } from '@angular/core/testing';
import { Observable, from, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DatabaseService } from './db.service';

interface StubDocumentReference {
  id: string;
}

interface StubIOrdersModelDatabase {
  Ots: number[];
  clientReference: string;
  orderNumber: number;
  documentID?: string;
}

describe('Service: DatabaseFirebaseService', () => {
  const dataTestFromDatabase: StubIOrdersModelDatabase = {
    Ots: [15001, 15002, 15003],
    clientReference: 'Clients/2p5zi2YlxaAw6Zz5RUr2',
    orderNumber: 12345,
    documentID: 'W5uRRDSAisHjnh7Xa67t',
  };
  // const dataForTableOperators: Observable<IOrderModelTable[]> = of([{
  //   otNumber: 123,
  //   clientName: 'asdf',
  //   id: 'asdf',
  // }]);

  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatabaseService,
      ],
      imports: [
      ],
    });

    service = TestBed.get(DatabaseService);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

});


