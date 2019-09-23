import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { IClient } from '../models/client.model';
import { toArray, map, mergeMap } from 'rxjs/operators';
import { IOperator } from '../models/operator.model';
import { IOrder } from '../models/orders.model';
import { IOt } from '../models/ot.model';
import { ITableOperators } from '../models/table-operators.model';
import { ITableAdministrators } from '../models/table-administrators.models';
import * as R from 'ramda';
import { OtOperator } from '../models/ot-operator.model';
import { formatDate } from '@angular/common';
import { BodySendEmail } from '../models/body-send-email.model';
import { IResponse } from '../models/response.model';
import { CustomHttpService } from '../../core/http.service';



@Injectable()
export class HttpService {

  private url = 'http://192.168.1.207:3000/api';

  constructor(private http: CustomHttpService) { }

  public getClientFiltered(filter: string): Observable<IClient[]> {
    return this.http.get<IClient>(this.url + '/clients', {params: new HttpParams().set('filter', filter)})
    .pipe(map<any, IClient[]>((val: IResponse) => val.responseDesc));
  }

  public getAllClients(): Observable<IClient[]> {
    return this.http.get<IClient[]>(this.url + '/clients/all');
  }

  public getDataClient(idClient: string): Observable<IClient> {
    return this.http.get<IClient>(this.url + '/clients/data', {params: new HttpParams().set('id', idClient)});
  }

  public getOtsFromOrder(idOrder: string): Observable<IOt[]> {
    return this.http.get<IOt[]>(this.url + '/orders/ots', {params: new HttpParams().set('id', idOrder)});
  }

  public getOrderData(idOrder: string): Observable<IOrder> {
    return this.http.get<IOrder>(this.url + '/orders/data', {params: new HttpParams().set('id', idOrder)});
  }

  public getOperators(): Observable<IOperator[]> {
    return this.http.get<IClient>(this.url + '/operators').pipe(map<any, IOperator[]>((val: IResponse) => val.responseDesc));
  }

  public updateClient(client: IClient): Observable<any> {
    return this.http.put(this.url + '/clients', client);
  }

  public addNewClients(clients: IClient[]): Observable<any> {
    return this.http.post(this.url + '/clients', clients);
  }

  public deleteClient(client: IClient | string): Observable<any> {
    const id = typeof client === 'string' ? client : client.id;
    const url = `${this.url}/clients?id=${id}`;

    return this.http.delete(url);
  }

  public deleteOrder(order: IOrder | string): Observable<any> {
    const id = typeof order === 'string' ? order : order.id;
    const url = `${this.url}/orders?id=${id}`;

    return this.http.delete(url);
  }

  public addOrder(order: IOrder): Observable<any> {
    return this.http.post(this.url + '/orders', order);
  }

  public addOts(ots: IOt[]): Observable<any> {
    return this.http.post(this.url + '/ots', ots);
  }

  public getAllOts(): Observable<any> {
    return this.http.get(this.url + '/ots');
  }

  public setOtsFinished(otsOperators: OtOperator[]): Observable<any> {
    return this.http.post(this.url + '/ots/finish', otsOperators);
  }

  public getDataTableOperators(): Observable<ITableOperators[]> {
    return this.http.get<ITableOperators[]>(this.url + '/tableOperators');
  }

  public getDataTableAdministrators(): Observable<ITableAdministrators[]> {
    return this.http.get<ITableAdministrators[]>(this.url + '/tableAdministrators').pipe(mergeMap(first => {
      return from(first).pipe(mergeMap((val: any) => {
        const result = R.reduce((acc, data: any) => {
          const index = acc.findIndex(val1 => val1.orderNumberId === data.left.left.orderNumberId);
          const ot = data.left.left;
          if (index !== -1) {
            const element = acc.find(val1 => val1.orderNumberId === data.left.left.orderNumberId);
            element.otNumbers.push(ot);
            acc.splice(index, 1, element);
          } else {
            const row: ITableAdministrators = {
              clientData: {
                id: data.left.right.clientId,
                name: data.right.name,
                tlf: data.right.tlf,
                email: data.right.email
              },
              avisoEmail: data.left.right.avisoEmail === '' ? 'No avisado' : data.left.right.avisoEmail,
              avisoSMS: data.left.right.avisoSMS === '' ? 'No avisado' : data.left.right.avisoSMS,
              orderNumber: data.left.right.orderNumber,
              orderNumberId: data.left.left.orderNumberId,
              otNumbers: [],
              state: data.left.right.finished ? 'Terminado' : 'No Terminado',
            };
            row.otNumbers.push(ot);
            acc.push(row);
          }
          return acc;
        }, [], val.reduction);
        return result;
      }), toArray());
    }));
  }

  public addPushSubscriber(subscriber: any) {
    return this.http.
      post(
        this.url + '/orderNotification/saveSubscription',
        subscriber,
        {headers: new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8')}
      );
  }

  // public sendNotificationOrderFinished(orderData: IOrder) {
  //   return this.http.post(this.url + '/orderNotification/sendOrderFinishedNotification', orderData);
  // }

  public sendSMS(order: ITableAdministrators) {
    const body = {
      'api_key': '',
      'fake': 0,
      'messages': [
        {
          'from': '',
          'to': `34${order.clientData.tlf}`,
          // tslint:disable-next-line
          'text': `Hola ${order.clientData.name}, su pedido ${order.orderNumber} se encuentra listo para recoger en nuestras instalaciones.`,
          'send_at': `${formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', 'en-US')}`
        },
      ]
    };
    return this.http.post(
      this.url + '/sendSMS',
      { orderId: order.orderNumberId, dataSMS: body },
      { headers: new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8') }
    );
  }

  public sendEmail(order: ITableAdministrators): Observable<IResponse> {
    const body: BodySendEmail = {
      orderId: order.orderNumberId,
      clientEmail: order.clientData.email,
      clientName: order.clientData.name,
      orderNumber: order.orderNumber
    };
    return this.http.post<IResponse>(this.url + '/sendEmail', body,
      { headers: new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8') }
    );
  }

  // public getNotifications(order: IOrder): Observable<Notification> {
  //   return this.http.get<Notification>(this.url + '/notifications', {params: new HttpParams().set('id', order.id)});
  // }

  // public addNotifications(orderid: string, notificationData: INotification): Observable<any> {
  //   return this.http.post(this.url + '/notifications',
  //   {
  //     orderNumberId: orderid,
  //     email: notificationData.email,
  //     sms: notificationData.sms
  //   });
  // }

}
