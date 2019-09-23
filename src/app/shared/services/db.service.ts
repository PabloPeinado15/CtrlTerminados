import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import { ITableOperators } from '../models/table-operators.model';
import * as io from 'socket.io-client';
import { HttpService } from './client.http.service';
import { IOperator } from '../models/operator.model';
import { ITableAdministrators } from '../models/table-administrators.models';
import { map, share } from 'rxjs/operators';
import { Socket } from 'socket.io';
import { MatSnackBar } from '@angular/material';
import { IClient } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  // Our socket connection
  private socket: Socket;
  private socketAdministrators: Socket;
  // If you aren't familiar with environment variables then
  // you can hard code `environment.ws_url` as `http://localhost:3000`
  private urlSocketOperators = 'http://192.168.1.207:3000/operators';
  private urlSocketAdministrators = 'http://192.168.1.207:3000/administrators';
  private changeFeedTableOperators: Rx.BehaviorSubject<ITableOperators[]>;
  private changeFeedOperators: Rx.BehaviorSubject<IOperator[]>;
  private changeFeedTableAdministrators: Rx.BehaviorSubject<ITableAdministrators[]>;

  constructor(private http: HttpService, private snackBar: MatSnackBar) { }

  public getChangeFeedTableOperators(): Rx.BehaviorSubject<ITableOperators[]> {
    if (!this.changeFeedTableOperators) {
      this.changeFeedTableOperators = this.createChangeFeedTableOperators();
    } else {
      this.socket = io(this.urlSocketOperators);
    }
    return this.changeFeedTableOperators;
  }

  private createChangeFeedTableOperators(): Rx.BehaviorSubject<ITableOperators[]> {

    this.socket = io(this.urlSocketOperators);
    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let arr: Array<ITableOperators>;
    const observable = Rx.Observable.create((obs: Rx.Observer<ITableOperators[]>) => {
      if (arr) {
        obs.next(arr);
      }
      this.socket.on('changeFeedTableOperators', async (data) => {
        // console.log(data);
        if (data.type === 'state' && data.state === 'ready') {
          arr = await this.http.getDataTableOperators().toPromise();
        } else {
          switch (data.type) {
            case 'add':
              if (data.new_val.table === 'Ots') {
                // const ots = await this.http.getOtsFromOrder(data.new_val.data.id).toPromise();
                // console.log(ots);
                const clientId = await this.http.getOrderData(data.new_val.data.orderNumberId)
                  .pipe(map((val: any) => val.data.clientId)).toPromise();
                const clientName = await this.http.getDataClient(clientId).pipe(map((val: any) => val.data.name)).toPromise();
                const row: ITableOperators = {
                  clientId: clientId,
                  clientName: clientName,
                  orderNumberId: data.new_val.data.orderNumberId,
                  otNumber: data.new_val.data.id,
                };
                arr.push(row);
              }
              break;
            case 'remove':
              if (data.old_val.table === 'Ots') {
                const index = arr.findIndex((val: any)  => val.otNumber === data.old_val.data.id);
                if (index !== -1) {
                  arr.splice(index, 1);
                }
              }
              break;
            case 'change':
              if (data.new_val.table === 'Clients' && arr.findIndex(val => val.clientId === data.new_val.data.id) !== -1) {
                arr.map(val => {
                  if (val.clientId === data.new_val.data.id) {
                    val.clientName = data.new_val.data.name;
                  }
                  return val;
                });
              }
              break;
          }
        }
        obs.next(arr);
      });
      this.socket.on('error', (error) => {
        console.log('error' + error);
        obs.error(error);
      });
      this.socket.on('disconnect', () => { console.log('complete'); obs.complete(); });
      return () => {
        console.log('disconnected');
        this.socket.disconnect();
      };
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    const observer = {
      next: (data: any) => {
        if (this.socket.connected === true) {
          this.socket.emit('changeFeedTableOperators', JSON.stringify(data));
        }
      }
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    const observableShared = observable.pipe(share());

    const behaviorSubject: Rx.BehaviorSubject<ITableOperators[]> =  Rx.BehaviorSubject.create(observer, observableShared);
    return behaviorSubject;
  }

  public getChangeFeedOperators(): Rx.BehaviorSubject<IOperator[]> {
    if (!this.changeFeedOperators) {
      this.changeFeedOperators = this.createChangeFeedOperators();
    } else {
      this.socket = io(this.urlSocketOperators);
    }
    return this.changeFeedOperators;
  }

  private createChangeFeedOperators(): Rx.BehaviorSubject<IOperator[]> {

    this.socket = io(this.urlSocketOperators);

    let initializing;
    let arr: Array<IOperator> = [];
    let emision;
    const observable = Rx.Observable.create((obs: Rx.Observer<Array<IOperator>>) => {
      if (emision) {
        obs.next(emision);
      }
      this.socket.on('changeFeedOperators', (data) => {
        console.log(data);
        emision = {type: '', data: arr};

        if (data.type === 'state') {
          switch (data.state) {
            case 'initializing':
              initializing = true;
              break;
            case 'ready':
              initializing = false;
              break;
          }
        }

        if (initializing) {
          switch (data.type) {
            case 'initial':
              arr.push(data.new_val);
              break;
          }
        } else {
          switch (data.type) {
            case 'add':
              arr.push(data.new_val);
              break;
            case 'remove':
              arr.splice(arr.findIndex((val: any)  => val.id === data.old_val.id), 1);
              emision.type = 'remove';
              break;
            case 'change':
              const element = arr.find((val: any) => val.id === data.new_val.id);
              element.name = data.new_val.name;
              arr.splice(arr.findIndex((val: any)  => val.id === data.new_val.id), 1, element);
              break;
          }
        }
        console.log(emision);
        obs.next(emision);
      });
      this.socket.on('error', (error) => {
        console.log('error' + error);
        obs.error(error);
      });
      this.socket.on('disconnect', () => { console.log('complete'); obs.complete(); });
      return () => {
        arr = [];
        console.log('disconnected');
        this.socket.disconnect();
      };
    });

    const observer = {
      next: (data: any) => {
        if (this.socket.connected === true) {
          this.socket.emit('changeFromClient', JSON.stringify(data));
        }
      }
    };

    const observableShared = observable.pipe(share());

    const behaviorSubject: Rx.BehaviorSubject<IOperator[]> =  Rx.BehaviorSubject.create(observer, observableShared);
    return behaviorSubject;
  }

  public getChangeFeedTableAdministrators(): Rx.BehaviorSubject<ITableAdministrators[]> {
    if (!this.changeFeedTableAdministrators) {
      this.changeFeedTableAdministrators = this.createChangeFeedTableAdministrators();
    } else {
      this.socketAdministrators = io(this.urlSocketAdministrators);
    }
    return this.changeFeedTableAdministrators;
  }

  private createChangeFeedTableAdministrators(): Rx.BehaviorSubject<ITableAdministrators[]> {
    console.log('change feed table created');
    this.socketAdministrators = io(this.urlSocketAdministrators);
    let arr: Array<ITableAdministrators> = [];
    const observable = Rx.Observable.create(async (obs: Rx.Observer<Array<ITableAdministrators>>) => {
      arr = await this.http.getDataTableAdministrators().toPromise();
      if (arr) {
        obs.next(arr);
      }
      this.socketAdministrators.on('changeFeedTableAdministrators', (data) => {
        console.log(data);
        if (data.type === 'state' && data.state === 'ready') {
          // arr = await this.http.getDataTableAdministrators().toPromise();
        } else {
          switch (data.type) {
            case 'add':
              if (data.new_val.table === 'Ots') {
                const index = arr.findIndex(val => val.orderNumberId === data.new_val.data.orderNumberId);
                if (index !== -1) {
                  const element = arr.find(val => val.orderNumberId === data.new_val.data.orderNumberId);
                  element.otNumbers.push(data.new_val.data);
                  arr.splice(index, 1, element);
                }
              } else if (data.new_val.table === 'Orders') {
                const index = arr.findIndex(val => val.orderNumberId === data.new_val.data.id);
                if (index !== -1) {
                  const element = arr.find(val => val.orderNumberId === data.new_val.data.id);
                  element.clientData.id = data.new_val.data.clientId;
                  element.orderNumber = data.new_val.data.orderNumber;
                  element.orderNumberId = data.new_val.data.id;
                  element.state = data.new_val.data.finished ? 'Terminado' : 'No terminado';
                  arr.splice(index, 1, element);
                } else {
                  const element: ITableAdministrators = {
                    clientData: {
                      id: data.new_val.data.clientId,
                      name: '',
                      email: '',
                      tlf: '',
                    },
                    orderNumber: data.new_val.data.orderNumber,
                    orderNumberId: data.new_val.data.id,
                    otNumbers: [],
                    state: data.new_val.data.finished ? 'Terminado' : 'No terminado',
                    avisoEmail: data.new_val.data.avisoEmail === '' ? 'No avisado' : data.new_val.data.avisoEmail,
                    avisoSMS: data.new_val.data.avisoSMS === '' ? 'No avisado' : data.new_val.data.avisoSMS
                  };

                  // Obtenemos los datos de las notificaciones de dichos pedidos
                  // this.http.getNotifications(data.new_val.data.id).pipe(map((val: any) => val.data)).toPromise()
                  //   .then((dataNotifications: INotification) => {
                  //     element.notifications = {
                  //       email: dataNotifications.email,
                  //       sms: dataNotifications.sms
                  //     };
                  //   });

                  // Obtenemos los datos de el cliente asignado al pedido
                  this.http.getDataClient(data.new_val.data.clientId).pipe(map((val: any) => val.responseDesc)).toPromise()
                    .then((val: IClient) => {
                      element.clientData.name = val.name;
                      element.clientData.tlf = val.tlf;
                      element.clientData.email = val.email;
                    });
                  arr.push(element);
                }
              }
              break;
            case 'remove':
              if (data.old_val.table === 'Orders') {
                const index = arr.findIndex((val: ITableAdministrators)  => val.orderNumberId === data.old_val.data.id);
                if (index !== -1) {
                  arr.splice(index, 1);
                }
              }
              break;
            case 'change':
              if (data.new_val.table === 'Clients') {
                arr.forEach((element: ITableAdministrators) => {
                  if (element.clientData.id === data.new_val.data.id) {
                    element.clientData.name = data.new_val.data.name;
                    element.clientData.tlf = data.new_val.data.tlf;
                    element.clientData.email = data.new_val.data.email;
                  }
                });
              } else if (data.new_val.table === 'Orders') {
                const element = arr.find(val => val.orderNumberId === data.new_val.data.id);
                element.state = data.new_val.data.finished ? 'Terminado' : 'No Terminado';
                element.avisoEmail = data.new_val.data.avisoEmail === '' ? 'No avisado' : data.new_val.data.avisoEmail;
                element.avisoSMS = data.new_val.data.avisoSMS === '' ? 'No avisado' : data.new_val.data.avisoSMS;
                if (element) {
                  const index = arr.indexOf(element);
                  if (index !== -1 ) {
                    arr.splice(index, 1, element);
                  }
                }
                // if (data.new_val.data.finished && data.old_val.data.finished !== data.new_val.data.finished) {
                //   this.http.sendNotificationOrderFinished(data.new_val.data).subscribe(val => {
                //     console.log('notificación enviada ' + val);
                //   });
                // }
              } else if (data.new_val.table === 'Ots') {
                const element = arr.find(val => val.orderNumberId === data.new_val.data.orderNumberId);
                element.otNumbers.forEach(ot => {
                  if (ot.id === data.new_val.data.id) {
                    ot.dateFinished = data.new_val.data.dateFinished;
                    ot.finished = data.new_val.data.finished;
                    ot.nameOperator = data.new_val.data.nameOperator;
                    ot.operatorId = data.new_val.data.operatorId;
                  }
                });
                if (element) {
                  const index = arr.indexOf(element);
                  if (index !== -1 ) {
                    arr.splice(index, 1, element);
                  }
                }
              }
              break;
          }
        }
        obs.next(arr);
      });
      this.socketAdministrators.on('error', (error) => {
        console.log('error' + error);
        obs.error(error);
      });
      this.socketAdministrators.on('disconnect', () => { console.log('complete'); obs.complete(); });
      return () => {
        console.log('disconnected');
        this.socketAdministrators.disconnect();
      };
    });

    const observer = {
      next: (data: any) => {
        if (this.socketAdministrators.connected === true) {
          this.socketAdministrators.emit('changeFromClient', JSON.stringify(data));
        }
      }
    };

    const observableShared = observable.pipe(share());
    // const observableShared = observable.pipe();

    const behaviorSubject: Rx.BehaviorSubject<ITableAdministrators[]> =  Rx.BehaviorSubject.create(observer, observableShared);
    return behaviorSubject;
  }

}

