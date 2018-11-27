import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Order } from '../domain/domain';
import { CompletedOrder } from '../domain/domain';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap, retry } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/error-handler.service';
import { error } from 'util';
import { Subscription } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class OrderDataService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl + 'api/Orders/GetAllOrders')
      .pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(ErrorHandlerService.handleError));
  }

  getPagedOrders(pageNumber: number, status: number, searchTerm: string): Observable<Order[]> {
    const params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('status', status.toString())
      .set('searchTerm', searchTerm.toString());

    return this.http.get<Order[]>(this.baseUrl + 'api/Orders/GetPagedOrders', { params })
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(ErrorHandlerService.handleError));
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(this.baseUrl + 'api/Orders/' + id)
      .pipe(catchError(ErrorHandlerService.handleError));
  }

  updateOrder(order: Order): Observable<Order>  {
    return this.http.put<Order>(this.baseUrl + 'api/Orders/' + order.id, order, httpOptions)
      .pipe(catchError(ErrorHandlerService.handleError));
  }

  newOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.baseUrl + 'api/Orders/NewOrder', order, httpOptions)
      .pipe(catchError(ErrorHandlerService.handleError));
  }

  scheduledOrders(): Observable<number> {
    return this.http.post<number>(this.baseUrl + 'api/Orders/ScheduleOrders', null, httpOptions)
      .pipe(catchError(ErrorHandlerService.handleError));
  }

  completeOrder(completedOrder: CompletedOrder): Observable<CompletedOrder> {
    return this.http.post<CompletedOrder>(this.baseUrl + 'api/Orders/CompleteOrder', completedOrder, httpOptions)
      .pipe(catchError(ErrorHandlerService.handleError));
  }
}

