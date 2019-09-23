import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ITableAdministrators } from '../../shared/models/table-administrators.models';
import { DatabaseService } from '../../shared/services/db.service';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { HttpService } from '../../shared/services/client.http.service';
import { IResponse } from '../../shared/models/response.model';
import { DeleteOrderDialogComponent } from './delete-order-dialog.component';

const initialSelection: any[] = [];
const allowMultiSelect = true;

@Component({
  selector: 'table-administrators', // tslint:disable-line
  templateUrl: 'table-administrators.component.html',
  styleUrls: ['table-administrators.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableAdministradoresComponent implements OnInit, AfterViewInit, OnDestroy {

  columnsToDisplay = ['select', 'orderNumber', 'clientName', 'state', 'notifications'];
  dataSource = new MatTableDataSource<ITableAdministrators>();
  selection = new SelectionModel<ITableAdministrators>(allowMultiSelect, initialSelection);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  expandedElement: ITableAdministrators;
  ordersSelected: Array<ITableAdministrators> = new Array();
  subscriptionTableAdministrators: Subscription;
  subscriptionRowsSelected: Subscription;

  constructor(
    private dbService: DatabaseService,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.subscriptionTableAdministrators = this.dbService.getChangeFeedTableAdministrators().subscribe(data => {
      console.log(data);
      this.dataSource.data = data;
    });
    this.subscriptionRowsSelected = this.selection.onChange.subscribe(value => {
      console.log(value);
      console.log(value.added);
      const valueAdded = value.added;
      const valueRemoved = value.removed;

      const addItem = (val) => {
        this.ordersSelected.push(...val);
      };
      const removeItem = (val) => {
        for (let row of valueRemoved) {
          this.ordersSelected.splice(this.ordersSelected.indexOf(row), 1);
        }
      };

      addItem(valueAdded);
      removeItem(valueRemoved);
    });
  }

  sendSMS() {
    this.ordersSelected.forEach((element: ITableAdministrators) => {
      this.httpService.sendSMS(element).subscribe(result => {
        console.log(result);
        this.ordersSelected.splice(
          this.ordersSelected.findIndex((val: ITableAdministrators) => val.orderNumberId === element.orderNumberId),
          1
        );
        this.selection.clear();
      });
    });
  }

  sendEmail() {
    this.ordersSelected.forEach((element: ITableAdministrators) => {
      this.httpService.sendEmail(element).subscribe(result => {
        this.ordersSelected.splice(
          this.ordersSelected.findIndex((val: ITableAdministrators) => val.orderNumberId === element.orderNumberId),
          1
        );
        this.selection.clear();
      });
    });
  }

  showAlertClientsWithoutTelephone() {
    let alert = 'Los siguientes clientes no disponen de teléfono: ';
    const filtered = this.ordersSelected.filter(val => val.clientData.tlf === '');
    filtered.forEach( order => {
      if (order.orderNumberId === filtered.slice(filtered.length - 1, filtered.length)[0].orderNumberId) {
        alert += order.clientData.name + '.';
      } else {
        alert += order.clientData.name + ', ';
      }
    });
    this.snackBar.open(alert, 'Aceptar', {duration: 10000});
  }

  showAlertClientsWithoutEmail() {
    let alert = 'Los siguientes clientes no disponen de correo electrónico: ';
    const filtered = this.ordersSelected.filter(val => val.clientData.email === '');
    filtered.forEach( order => {
      if (order.orderNumberId === filtered.slice(filtered.length - 1, filtered.length)[0].orderNumberId) {
        alert += order.clientData.name + '.';
      } else {
        alert += order.clientData.name + ', ';
      }
    });
    this.snackBar.open(alert, 'Aceptar', {duration: 10000});
  }

  checkClientsEmail() {
    return this.ordersSelected.filter(order => order.clientData.email === '').length > 0 ? true : false;
  }

  checkClientsSMS() {
    return this.ordersSelected.filter(order => order.clientData.tlf === '').length > 0 ? true : false;
  }

  deleteSelectedOrders() {
    if (this.ordersSelected.length > 0) {
      const dialogRef = this.dialog.open(DeleteOrderDialogComponent, {
        data: { ordersToDelete: this.ordersSelected.length },
        width: '350px',
        height: '180px',
        hasBackdrop: true
      });
      dialogRef.afterClosed().subscribe(optionYes => {
        if (optionYes) {
          this.ordersSelected.forEach((element: ITableAdministrators) => {
            this.httpService.deleteOrder(element.orderNumberId).subscribe(() => {
              this.ordersSelected.splice(
                this.ordersSelected.findIndex((val: ITableAdministrators) => val.orderNumberId === element.orderNumberId),
                1
              );
              this.selection.clear();
            });
          });
        } else {
          this.ordersSelected.splice(0);
          this.selection.clear();
        }
      });
    }
  }

  ngAfterViewInit(): void {
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
    const filtro = filterValue.trim().toLowerCase();
    this.dataSource.filter = filtro;
    this.dataSource.filterPredicate = (data, filter) => {
      filter = filter.toLowerCase();
      if (
        data.avisoEmail.toLowerCase().includes(filter) ||
        data.avisoSMS.toLowerCase().includes(filter) ||
        data.clientData.email.toLowerCase().includes(filter) ||
        data.clientData.name.toLowerCase().includes(filter) ||
        data.clientData.tlf.includes(filter) ||
        String(data.orderNumber).includes(filter) ||
        data.state.toLowerCase().includes(filter) ||
        data.otNumbers.some((valueOt) => {
          return String(valueOt.id).includes(filter);
        })
      ) {
        return true;
      } else {
        return false;
      }
    };
  }

  ngOnDestroy(): void {
    this.subscriptionTableAdministrators.unsubscribe();
    this.subscriptionRowsSelected.unsubscribe();
  }

}
