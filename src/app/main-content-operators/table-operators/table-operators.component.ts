import { Component, EventEmitter, ViewChild, AfterViewInit, OnDestroy, OnInit, Output } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { AdapterService } from '../../shared/services/adapter.service';
import { ITableOperators } from '../../shared/models/table-operators.model';
import { DatabaseService } from '../../shared/services/db.service';
import { HttpService } from '../../shared/services/client.http.service';

const initialSelection: any[] = [];
const allowMultiSelect = true;


@Component({
  selector: 'table-operators', // tslint:disable-line
  templateUrl: './table-operators.component.html',
  styleUrls: ['./table-operators.component.css']
})
export class TableOperariosComponent implements AfterViewInit, OnDestroy, OnInit {

  columnsToDisplay = ['select', 'otNumber', 'clientName'];
  selection = new SelectionModel<ITableOperators>(allowMultiSelect, initialSelection);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  subscriptionObservableDataTableOperators: Subscription;
  subscriptionRowsSelected: Subscription;
  dataSource = new MatTableDataSource<ITableOperators>();
  dataRow: ITableOperators[];
  mockData: ITableOperators[] = new Array;
  otsSelected: ITableOperators[] = new Array;
  @Output() otsSelectedEventEmitter: EventEmitter<ITableOperators[]> = new EventEmitter();

  constructor(private dataService: AdapterService,  private dbService: DatabaseService, private httpService: HttpService) { }

  ngOnInit() {

    this.subscriptionObservableDataTableOperators = this.dbService.getChangeFeedTableOperators().subscribe(data => {
      console.log(data);
      this.dataSource.data = data;
    });

    this.subscriptionRowsSelected = this.selection.onChange.subscribe(value => {
      console.log(value.added);
      const valueAdded = value.added;
      const valueRemoved = value.removed;

      const addItem = (val) => {
        this.otsSelected.push(...val);
      };
      const removeItem = (val) => {
        for (let ot of valueRemoved) {
          this.otsSelected.splice(this.otsSelected.indexOf(ot), 1);
        }
      };

      addItem(valueAdded);
      removeItem(valueRemoved);
      this.otsSelectedEventEmitter.emit(this.otsSelected);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows  = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach( row => this.selection.select(row));
  }

  ngOnDestroy() {
    this.subscriptionObservableDataTableOperators.unsubscribe();
    this.subscriptionRowsSelected.unsubscribe();
  }

}
