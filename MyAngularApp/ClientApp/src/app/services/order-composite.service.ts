import { Injectable } from '@angular/core';
import { Order } from '../domain/domain';
import { Observable } from 'rxjs/Observable';
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

  private selectedOrder: Observer<Order>;
  public selectedOrderSignal: Observable<Order> = new Observable(observer => this.selectedOrder = observer);

  setDetailState(state: boolean) {
    this.detailIsOpen.next(state);
  }

  signalNewOrderAdded(order: Order) {
    this.newOrderAdded.next(order);
  }

  signalOrderUpdated(order: Order) {
    this.updatedOrder.next(order);
  }

  signalOrderSelected(order: Order) {
    this.selectedOrder.next(order);
  }
}
