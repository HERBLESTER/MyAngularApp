import { Injectable } from '@angular/core';
import { Order } from '../domain/domain';
import { Observable } from 'rxjs/Observable';
import { Observer} from 'rxjs';

@Injectable()
export class OrderCompositeService {

  constructor() { }

  private newOrderAdded: Observer<Order>;
  public newOrderSignal: Observable<Order> = new Observable(observer => this.newOrderAdded = observer);

  private updatedOrder: Observer<Order>;
  public updatedOrderSignal: Observable<Order> = new Observable(observer => this.updatedOrder = observer);

  signalNewOrderAdded(order: Order) {
    this.newOrderAdded.next(order);
  }

  signalOrderUpdated(order: Order) {
    this.updatedOrder.next(order);
  }
}
