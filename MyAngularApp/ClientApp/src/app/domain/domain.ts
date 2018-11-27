
export interface City {
  id: number;
  name: string;
}

export interface Operation {
  id: number;
  name: string;
}

export interface Customer {
  id: number;
  name: string;
}

export interface MetaData {
  cities: City[],
  operations: Operation[],
  customers: Customer[]
}

export class Order {
  public constructor() { }
  public id: number;
  public customerId: number;
  public customerName: string;
  public street: string;
  public cityId: number;
  public cityName: string;
  public dateReceived: Date;
  public operationId: number;
  public operationName: string;
  public notes: string;
  public status: Status = Status.Received;
  public completed: Date;
  public asset: string;
  public installerComment: string;
  public orderCount: number;
  public cancelled: Date;
  public scheduled: Date;

}

export interface CompletedOrder {
  orderId: number;
  comments: string;
  completed: Date;
  asset: string;
}

export enum Status { Received, Scheduled, enRoute, Cancelled, Completed }
