import { TestBed } from '@angular/core/testing';
import { OrderCompositeService } from './order-composite.service';
import { Order } from '../domain/domain';

describe('OrderCompositeService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [OrderCompositeService]
  }));

  it('should be created', () => {
    const service: OrderCompositeService = TestBed.get(OrderCompositeService);
    expect(service).toBeTruthy();
  });

  it('#signalNewOrderAdded should cause an order to be returned from a subscription', () => {
    const service: OrderCompositeService = TestBed.get(OrderCompositeService);
    const order: Order = new Order();
    service.newOrderSignal.subscribe(order => expect(order).toEqual(order));
    service.signalNewOrderAdded(order);
  });

  it('#signalOrderUpdated should cause an order to be returned from a subscription', () => {
    const service: OrderCompositeService = TestBed.get(OrderCompositeService);
    const order: Order = new Order();
    service.updatedOrderSignal.subscribe(order => expect(order).toEqual(order));
    service.signalOrderUpdated(order);

  });

  
});
