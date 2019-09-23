export interface IOrder {
  id?: string;
  orderNumber: number;
  clientId: string;
  finished: boolean;
  visible: boolean;
  avisoEmail: string;
  avisoSMS: string;
}
