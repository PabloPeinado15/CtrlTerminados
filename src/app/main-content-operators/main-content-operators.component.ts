import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { IOperator } from '../shared/models/operator.model';
import { Observable, Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { ITableOperators } from './../shared/models/table-operators.model';
import { HttpService } from '../shared/services/client.http.service';
import { MatSelect } from '@angular/material';
import { DatabaseService } from '../shared/services/db.service';
import { OtOperator } from '../shared/models/ot-operator.model';
import { TableOperariosComponent } from './table-operators/table-operators.component';
import { SwUpdate, SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-main-content-operators',
  templateUrl: './main-content-operators.component.html',
  styleUrls: ['./main-content-operators.component.css']
})
export class MainContentOperatorsComponent implements OnInit, OnDestroy {

  readonly VAPID_PUBLIC_KEY = '';

  operators$: Observable<any[]>;
  operatorSelected: IOperator;
  otsSelected: ITableOperators[] = new Array;
  subscriptionChangeFeedOperators: Subscription;
  operatorSelect = new FormControl('', [
    Validators.required,
  ]);
  dataSelectOperators: IOperator[] ;

  @ViewChild('idSelectOperators') mySelect: MatSelect;
  @ViewChild(TableOperariosComponent) tableOperariosComponent: TableOperariosComponent;

  constructor(
    private clientHttpService: HttpService,
    private dbService: DatabaseService,
    private sw: SwUpdate,
    private swPush: SwPush
  ) { }

  ngOnInit() {
    this.subscriptionChangeFeedOperators = this.dbService.getChangeFeedOperators().subscribe((data: any) => {
      if (data.type === 'remove') {
        this.operatorSelect.patchValue('');
        this.mySelect.open();
        this.dataSelectOperators = data.data;
      } else {
        this.dataSelectOperators = data.data;
      }
    });
  }

  handlerOtsEvents($event) {
    this.otsSelected = $event;
  }

  setOtsFinished() {
    const otsOperators: OtOperator[] = [];
    for (let ot of this.otsSelected) {
      otsOperators.push({
        id: ot.otNumber,
        operatorId: this.operatorSelected.id,
        dateFinished: new Date(Date.now()).toLocaleString(),
        orderNumberId: ot.orderNumberId,
        nameOperator: this.operatorSelected.name,
      });
    }
    if (otsOperators.length > 0) {
      this.clientHttpService.setOtsFinished(otsOperators).subscribe(val => {
        console.log(val);
        this.tableOperariosComponent.selection.clear();
        this.operatorSelect.patchValue('');
        this.mySelect.open();
      });
    }

    // WEB PUSH Notifications

    // if (this.sw.isEnabled) {
    //   this.sw.available.subscribe(() => {
    //     console.log('new version available');
    //   });
    // }

    // if (this.swPush.isEnabled) {
    //   this.swPush.requestSubscription({
    //     serverPublicKey: this.VAPID_PUBLIC_KEY
    //   }).then(val => {
    //     console.log('Solicitud de subscripción');
    //     const valJSON = JSON.stringify(val);
    //     console.log(valJSON);
    //     this.clientHttpService.addPushSubscriber(valJSON).subscribe(result => console.log(result));
    //   });
    // }

  }

  get showOtsSelected() {
    return this.otsSelected.map(val => val.otNumber).join(' ');
  }

  get operatorSelectedOnSelect() {
    return JSON.stringify(this.operatorSelected);
  }

  ngOnDestroy(): void {
    this.subscriptionChangeFeedOperators.unsubscribe();
  }

}
