import { Injectable } from '@angular/core';
import { Order } from '../domain/domain';
import { CompletedOrder } from '../domain/domain';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap, retry } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Observer } from 'rxjs';

@Injectable()
export class OrderCompositeService {

  constructor() { }
  private detailIsOpen: Observer<boolean>;
  public detailState: Observable<boolean> = new Observable(observer => this.detailIsOpen = observer);

  private mewOrderAdded: Observer<Order>;
  public newOrderSignal: Observable<Order> = new Observable(observer => this.mewOrderAdded = observer);

  setDetailState(state: boolean) {
    this.detailIsOpen.next(state);
  }

  signalNewOrderAdded(order: Order) {
    this.mewOrderAdded.next(order);
  }
}
