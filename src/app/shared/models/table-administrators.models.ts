import { IOt } from './ot.model';
import { IClient } from './client.model';

export interface ITableAdministrators {
  orderNumber: number;
  otNumbers: IOt[];
  state: string;
  orderNumberId: string;
  clientData: IClient;
  avisoEmail: string;
  avisoSMS: string;
}
