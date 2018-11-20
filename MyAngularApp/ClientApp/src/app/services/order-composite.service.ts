import { Injectable } from '@angular/core';
import { Order } from '../domain/domain';
import { CompletedOrder } from '../domain/domain';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap, retry } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Observer, BehaviorSubject } from 'rxjs';

@Injectable()
export class OrderCompositeService {

  constructor() { }
  private detailIsOpen: Observer<boolean>;
  public detailState: Observable<boolean> = new Observable(observer => this.detailIsOpen = observer);

  private newOrderAdded: Observer<Order>;
  public newOrderSignal: Observable<Order> = new Observable(observer => this.newOrderAdded = observer);

  private updatedOrder: Observer<Order>;
  public updatedOrderSignal: Observable<Order> = new Observable(observer => this.updatedOrder = observer);

  setDetailState(state: boolean) {
    this.detailIsOpen.next(state);
  }

  signalNewOrderAdded(order: Order) {
    this.newOrderAdded.next(order);
  }

  signalOrderUpdated(order: Order) {
    this.updatedOrder.next(order);
  }
}
