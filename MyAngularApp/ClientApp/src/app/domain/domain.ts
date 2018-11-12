
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
  public datePlaced: Date;
  public operationId: number;
  public operationName: string;
  public notes: string;
  public status: Status = Status.Received;
}

export class CompletedOrder {
  public constructor() { }
  orderId: number;
  comments: string;
  completed: Date;
  asset: string;
}

export enum Status { Received, enRoute, Cancelled, Completed }
