import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

export interface IDataTableRegistry {
  orderNumber: number;
  otNumber: number;
  clientName: string;
  state: boolean;
  markedFinished: IMarkedFinished;
  advice: IAdvice;
}

export interface IMarkedFinished {
  operator: string;
  dateMarked: Date;
}

export interface IAdvice {
  administrator: string;
  method: string;
  dateAdvice: Date;
}

/* tslint:disable */
const DATA_TABLE_REGISTRY: IDataTableRegistry[] = [
  {orderNumber: 57801, otNumber: 57801, clientName: 'Cliente 1', state: true, markedFinished: {operator: 'Operador 13', dateMarked: new Date()}, advice: {administrator: 'Administrador 1', method: 'Email', dateAdvice: new Date()} },
  
];
/* tslint:enable */

const initialSelection: any[] = [];

const allowMultiSelect = true;

@Component({
  selector: 'table-registry', // tslint:disable-line
  templateUrl: './table-registry.component.html',
  styleUrls: ['./table-registry.component.css']
})

export class TableRegistryComponent implements OnInit {

  columnsToDisplay = ['orderNumber', 'otNumber', 'clientName', 'markedFinished', 'lastAdvice'];

  dataSource = new MatTableDataSource<IDataTableRegistry>(DATA_TABLE_REGISTRY);

  selection = new SelectionModel<IDataTableRegistry>(allowMultiSelect, initialSelection);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) matSort: MatSort;

  constructor() {}

  ngOnInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.matSort;
  }

  isAllSelected(): boolean {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
  }

  masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
  }

  applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
