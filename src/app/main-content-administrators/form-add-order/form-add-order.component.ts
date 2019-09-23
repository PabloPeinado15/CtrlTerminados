import { Component, Output, Input, OnInit, ViewChild } from '@angular/core';
import { IClient } from '../../shared/models/client.model';
import { Observable } from 'rxjs';
import { map, startWith, tap, switchMap, reduce, debounceTime } from 'rxjs/operators';
import { FormControl, Validators, FormGroup, NgModel, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatOption, MatAutocomplete, MatAutocompleteTrigger, MatSnackBar } from '@angular/material';
import { HttpService } from '../../shared/services/client.http.service';
import { IOrder } from '../../shared/models/orders.model';
import { IOt } from '../../shared/models/ot.model';
import { IResponse } from '../../shared/models/response.model';

export interface Pedido {
  id: number;
  client: IClient;
  ots: number[];
}

enum ACTION {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE'
}

const atLeastOne = (validator: ValidatorFn, controls: string[] = null) => (
  group: FormGroup,
): ValidationErrors | null => {
  if (!controls) {
    controls = Object.keys(group.controls);
  }
  const hasAtLeastOne = group && group.controls && controls
    .some(k => !validator(group.controls[k]));
  return hasAtLeastOne ? null : {
    atLeastOne: true,
  };
};

@Component({
  /* tslint:disable-next-line */
  selector: 'form-add-order',
  templateUrl: './form-add-order.component.html',
  styleUrls: ['./form-add-order.component.css']
})
export class FormAddOrderComponent implements OnInit {

  @ViewChild('orderForm') orderForm: FormGroup;
  @ViewChild('clienteFormControl') clienteFormControl: NgModel;
  @ViewChild('orderFormField') orderFormField: FormControl;
  @ViewChild('matOptionClients') matOption: MatOption;
  @ViewChild('autocomplete') matAutocomplete: MatAutocomplete;
  @ViewChild('autocomplete') matAutocompleteTrigger: MatAutocompleteTrigger;
  selectedClient: IClient;
  clientes$: Observable<IClient[]>;
  filteredOptions$: Observable<IClient[]>;
  editActive = false;
  addActive = false;

  modelPedidos: Pedido;

  clientFormGroup = new FormGroup({
    nameFormControl:  new FormControl('', [
      Validators.required,
    ]),
    emailFormControl: new FormControl('', [
      Validators.email,
    ]),
    tlfFormControl: new FormControl('', [
      Validators.minLength(9),
      Validators.maxLength(9),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/),
    ])
  }, {validators: atLeastOne(Validators.required,
    ['emailFormControl', 'tlfFormControl'])});

  constructor(
    private clientHttpService: HttpService,
    private snackbar: MatSnackBar
  ) {  }

  clientSelectedHandler($event) {
    this.selectedClient = $event.option.value;
    this.editActive = false;
    this.addActive = false;
  }

  checkClient() {
    if (!this.selectedClient || this.selectedClient.id !== this.clienteFormControl.control.value.id) {
      this.clienteFormControl.control.setValue('');
      this.selectedClient = null;
    }
  }

  checkClientAlreadyInserted(clientToInsert: IClient, callback) {
    this.clientHttpService.getAllClients().subscribe((res: any) => {
      if (res.responseSuccess) {
        const clients = <Array<IClient>>res.responseDesc;
        let index;
        let existentClient;
        if (clientToInsert.id && clientToInsert.id.trim() !== '') {
          const filterFunctionWithId = client => {
            if (
              client.id !== clientToInsert.id &&
              (client.email.trim() !== '' && client.email === clientToInsert.email)
              || (client.tlf.trim() !== '' && client.tlf === clientToInsert.tlf)) {
              return true;
            }
            return false;
          };
          index = clients.findIndex(filterFunctionWithId);
          if (index !== -1) {
            existentClient = clients.find(filterFunctionWithId);
          }
        } else {
          const filterFunctionWithoutId = client => {
            if ((client.email.trim() !== '' && client.email === clientToInsert.email)
            || (client.tlf.trim() !== '' && client.tlf === clientToInsert.tlf)) {
              return true;
            }
            return false;
          };
          index = clients.findIndex(filterFunctionWithoutId);
          if (index !== -1) {
            existentClient = clients.find(filterFunctionWithoutId);
          }
        }
        if (index !== -1) {
          callback(true, existentClient);
        } else {
          callback(false, existentClient);
        }
      } else {
        callback(null, null);
      }
    });
  }

  editClient(action: ACTION) {

    switch (action) {
      case ACTION.ADD: {
        this.addActive = !this.addActive;

        const newClient: IClient = {
          email: this.clientFormGroup.value.emailFormControl,
          name: this.clientFormGroup.value.nameFormControl,
          tlf: this.clientFormGroup.value.tlfFormControl
        };

        this.checkClientAlreadyInserted(newClient, (alreadyInserted: boolean, client: IClient) => {
          console.log(alreadyInserted);
          if (alreadyInserted) {
            this.snackbar.open('Ya existe un cliente con el correo o teléfono introducido: ' + client.name, '', {duration: 2500});
          } else {
            const clients = [newClient];
            this.clientHttpService.addNewClients(clients).subscribe(val => {
              this.clienteFormControl.control.setValue(newClient);
              this.selectedClient = newClient;
            });
          }
        });
        break;
      }

      case ACTION.EDIT: {
        this.editActive = !this.editActive;

        const modifiedClient: IClient = {
          email: this.clientFormGroup.value.emailFormControl,
          name: this.clientFormGroup.value.nameFormControl,
          tlf: this.clientFormGroup.value.tlfFormControl,
          id: this.selectedClient.id
        };

        this.checkClientAlreadyInserted(modifiedClient, (alreadyInserted: boolean, client: IClient) => {
          console.log(alreadyInserted);
          if (alreadyInserted) {
            this.snackbar.open('Ya existe un cliente con el correo o teléfono introducido: ' + client.name, '', {duration: 2500});
          } else {
            console.log(this.selectedClient.id);
            this.clientHttpService.updateClient(modifiedClient).subscribe(console.log, console.log, () => console.log('complete'));
            this.clienteFormControl.control.setValue(modifiedClient);
            this.selectedClient = modifiedClient;
          }
        });
        break;
      }

      case ACTION.DELETE: {
        this.editActive = false;
        this.clientHttpService.deleteClient(this.selectedClient).subscribe(
          (val) => {
            console.log(val);
            this.selectedClient = null;
            this.clienteFormControl.control.setValue('');
          },
          () => {},
          () => console.log('complete')
        );
        break;
      }

    }

  }

  checkDuplicatedOt (callback) {
    this.clientHttpService.getAllOts().subscribe(res => {
      if (res.responseSuccess) {
        let otDuplicate = false;
        const otsDuplicates: IOt[] = [];
        this.modelPedidos.ots.map((val) => {
          const filterOtDuplicate = (ot: IOt) => ot.id === val;
          const index = res.responseDesc.findIndex(filterOtDuplicate);
          if (index !== -1) {
            otsDuplicates.push(res.responseDesc.find(filterOtDuplicate));
            otDuplicate = true;
          }
        });
        console.log(otDuplicate);
        callback(otDuplicate, otsDuplicates);
      }
    });
  }

  addOrder() {

    const order: IOrder = {
      clientId: this.modelPedidos.client.id,
      orderNumber: this.modelPedidos.id,
      finished: false,
      visible: true,
      avisoEmail: '',
      avisoSMS: ''
    };

    this.checkDuplicatedOt((otDuplicates: boolean, otsDuplicates: IOt[]) => {
      if (otDuplicates) {
        const textOtsDuplicates = otsDuplicates.map(val => val.id).join(',');
        this.snackbar.open('La ots introducidas se encuentran duplicadas: ' + textOtsDuplicates, '', {duration: 2500});
      } else {
        this.clientHttpService.addOrder(order).subscribe((responseAddOrder: IResponse) => {

          const ots: IOt[] = this.modelPedidos.ots.map(element => {
            return {
              id: element,
              finished: false,
              orderNumberId: responseAddOrder.responseDesc.generated_keys[0],
              operatorId: null,
              dateFinished: null,
              nameOperator: null
            };
          });
          this.clientHttpService.addOts(ots).subscribe(responseAddOts => {
            console.log('pedido y ots añadido');
            console.log(responseAddOts);
            this.orderFormField.reset();
            this.modelPedidos.ots.splice(0);
          });
          // this.clientHttpService.addNotifications(responseAddOrder.data.generated_keys[0], {email: '', sms: ''}).subscribe();
        });
      }
    });

  }

  activateEditing() {
    this.editActive = !this.editActive;
    this.addActive = false;
    this.clientFormGroup.get('nameFormControl').setValue(this.selectedClient.name);
    this.clientFormGroup.get('emailFormControl').setValue(this.selectedClient.email);
    this.clientFormGroup.get('tlfFormControl').setValue(this.selectedClient.tlf);
  }

  activateAdding() {
    this.addActive = !this.addActive;
    this.editActive = false;
    this.selectedClient = null;
    this.clientFormGroup.get('nameFormControl').setValue('');
    this.clientFormGroup.get('emailFormControl').setValue('');
    this.clientFormGroup.get('tlfFormControl').setValue('');
    this.clienteFormControl.control.setValue('');
  }

  get diagnostic() { return JSON.stringify(this.modelPedidos); }

  ngOnInit() {

    this.modelPedidos = {
      id: null,
      client: null,
      ots: []
    };

    this.filteredOptions$ = this.clienteFormControl.valueChanges
      .pipe(
        startWith<string | IClient>(''),
        debounceTime(250),
        map(value => value == null ? '' : value),
        map(value => typeof value === 'string' ? value : value.name),
        switchMap(name => {
          return this._filter(name);
        }),
        // tap(() => console.log(this.clienteFormControl.value)),
      );
  }

  displayFn(client?: IClient): string | undefined {
    return client ? client.name : undefined;
  }

  private _filter(value: string): Observable<IClient[]> {
    return this.clientHttpService.getClientFiltered(value);
  }

}
