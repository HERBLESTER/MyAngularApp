import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from '../domain/domain';
import { CompletedOrder } from '../domain/domain';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class OrderDataService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
  public orders: Order[];
  getOrders() {
    return this.http.get<Order[]>(this.baseUrl + 'api/Orders/GetAllOrders').subscribe(result => {
      this.orders = result;
    }, error => console.error(error));
  }

  getCustomerOrders() { }
  updateOrder(order: Order) { }

  newOrder(order: Order): void {
    this.http.post<Order>(this.baseUrl + 'api/Orders/NewOrder', order, httpOptions).subscribe(result => result);
  }

  getScheduledOrders() { }
  getCompletedOrders(begin: Date, end: Date) { }
  completeOrder(completedOrder: CompletedOrder) { }
}
interface WeatherForecast {
  dateFormatted: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
