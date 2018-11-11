import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class OrderDataService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getOrders() {
    //this.http.get<MetaData>(this.baseUrl + 'api/metadata/getmetadata').subscribe(result => {
    //  this.metaData = result;
    //}, error => console.error(error));
  }

  getCustomerOrders() { }
  updateOrder(order: Order) { }
  newOrder(order: Order) { }
  getScheduledOrders() { }
  getCompletedOrders(begin: Date, end: Date) { }
  completeOrder(completedOrder: CompletedOrder) { }
}

interface Order {
  id: number,
  customerId: number
  customerName: string,
  street: string,
  cityId: number,
  cityName: string,
  datePlaced: Date,
  operationId: number,
  operationName: string,
  notes: string,
  status: Status
}

interface CompletedOrder {
  orderId: number,
  comments: string,
  completed: Date,
  asset: string 
}

enum Status { Received, enRoute, Cancelled, Completed }
