import { Injectable } from '@angular/core';
import { DatabaseService } from './db.service';
import { Observable, of } from 'rxjs';
import { IOt } from './../models/ot.model';
import { IClient } from '../models/client.model';
import { ITableOperators } from '../models/table-operators.model';


@Injectable({
  providedIn: 'root',
})
export class AdapterService {

  constructor(private dbService: DatabaseService) { }

  // getDataTableOperators(): Observable<[IOt[], IClient[],  ITableOperators[]]> {
  //   return this.dbService.getDataTableOperatorsFromDB();
  // }

  // getDataTableAdministrators(): Observable<IAdministratorsModelTable[]> {
  //   return this.dbService.getDataTableAdministratorsFromDB();
  // }

}

