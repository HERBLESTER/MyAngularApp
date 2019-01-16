import { TestBed, inject } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { OrderDataService } from './order-data.service';
import { Order } from '../domain/domain';
import { CompletedOrder } from '../domain/domain';

function getBaseUrl() {
  return '';
}
const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

describe('OrderDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [providers, OrderDataService]
    });
  });

  const errorMessage = 'Something bad happened; please try again later.';
  const mockError = { status: 500, statusText: 'Bad Request' };

  it('should be created', () => {
    const service: OrderDataService = TestBed.get(OrderDataService);
    expect(service).toBeTruthy();
  });

  it('#getOrders should return orders from observable or Error', () => {
    let httpMock: HttpTestingController;
    const orders: Order[] = [new Order()];
    const service: OrderDataService = TestBed.get(OrderDataService);
    httpMock = TestBed.get(HttpTestingController);
    service.getOrders()
      .subscribe(value => {
        expect(value).length == 1;
        expect(value).toEqual(orders);
      });

    let request = httpMock.expectOne('api/Orders/GetAllOrders');
    expect(request.request.method).toBe("GET");
    request.flush(orders);
    httpMock.verify();

    let errResponse: any;
    service.getOrders()
      .subscribe(() => { }, err => {
        errResponse = err;
      });

    request = httpMock.expectOne('api/Orders/GetAllOrders');
    request.flush(errorMessage, mockError);
    request = httpMock.expectOne('api/Orders/GetAllOrders');
    request.flush(errorMessage, mockError);
    //due to retry
    expect(errResponse).toBe(errorMessage);
  });

  it('#getPagedOrders should return orders from observable or Error', () => {
    let httpMock: HttpTestingController;
    const orders: Order[] = [new Order(), new Order()];
    const service: OrderDataService = TestBed.get(OrderDataService);
    httpMock = TestBed.get(HttpTestingController);
    service.getPagedOrders(1, 1, '')
      .subscribe(value => {
        expect(value).length == 1;
        expect(value).toEqual(orders);
      });

    let request = httpMock.expectOne('api/Orders/GetPagedOrders?page=1&status=1&searchTerm=');
    expect(request.request.method).toBe("GET");
    request.flush(orders);
    httpMock.verify();

    let errResponse: any;
    service.getPagedOrders(1, 1, '')
      .subscribe(() => { }, err => {
        errResponse = err;
      });

    request = httpMock.expectOne('api/Orders/GetPagedOrders?page=1&status=1&searchTerm=');
    request.flush(errorMessage, mockError);
    request = httpMock.expectOne('api/Orders/GetPagedOrders?page=1&status=1&searchTerm=');
    request.flush(errorMessage, mockError);
    //retry
    expect(errResponse).toBe(errorMessage);
  });

  it('#getOrder should return an order from observable or Error', () => {
    let httpMock: HttpTestingController;
    const order: Order = new Order();
    const service: OrderDataService = TestBed.get(OrderDataService);
    httpMock = TestBed.get(HttpTestingController);
    service.getOrder(1)
      .subscribe(value => {
        expect(value).toEqual(order);
      });

    let request = httpMock.expectOne('api/Orders/1');
    expect(request.request.method).toBe("GET");
    request.flush(order);
    httpMock.verify();

    let errResponse: any;
    service.getOrder(1)
      .subscribe(() => { }, err => {
        errResponse = err;
      });

    request = httpMock.expectOne('api/Orders/1');
    request.flush(errorMessage, mockError);
    expect(errResponse).toBe(errorMessage);
  });

  it('#updateOrder should return the persisted order from observable or Error', () => {
    let httpMock: HttpTestingController;
    const order: Order = new Order();
    order.id = 1;
    const service: OrderDataService = TestBed.get(OrderDataService);
    httpMock = TestBed.get(HttpTestingController);
    service.updateOrder(order)
      .subscribe(value => {
        expect(value).toEqual(order);
      });

    let request = httpMock.expectOne('api/Orders/1');
    expect(request.request.method).toBe("PUT");
    request.flush(order);
    httpMock.verify();

    let errResponse: any;
    service.updateOrder(order)
      .subscribe(() => { }, err => {
        errResponse = err;
      });

    request = httpMock.expectOne('api/Orders/1');
    request.flush(errorMessage, mockError);
    expect(errResponse).toBe(errorMessage);
  });

  it('#New Order should return the persisted order from observable or Error', () => {
    let httpMock: HttpTestingController;
    const order: Order = new Order();
    order.id = 1;
    const service: OrderDataService = TestBed.get(OrderDataService);
    httpMock = TestBed.get(HttpTestingController);
    service.newOrder(order)
      .subscribe(value => {
        expect(value).toEqual(order);
      });

    let request = httpMock.expectOne('api/Orders/NewOrder');
    expect(request.request.method).toBe("POST");
    request.flush(order);
    httpMock.verify();

    let errResponse: any;
    service.newOrder(order)
      .subscribe(() => { }, err => {
        errResponse = err;
      });

    request = httpMock.expectOne('api/Orders/NewOrder');
    request.flush(errorMessage, mockError);
    expect(errResponse).toBe(errorMessage);
  });

  it('#Schedule Order should return the number of orders updated from observable or Error', () => {
    let httpMock: HttpTestingController;
    const service: OrderDataService = TestBed.get(OrderDataService);
    httpMock = TestBed.get(HttpTestingController);
    service.scheduledOrders()
      .subscribe(value => {
        expect(value).toEqual(1);
      });

    let request = httpMock.expectOne('api/Orders/ScheduleOrders');
    expect(request.request.method).toBe("POST");
    request.flush(1);
    httpMock.verify();

    let errResponse: any;
    service.scheduledOrders()
      .subscribe(() => { }, err => {
        errResponse = err;
      });

    request = httpMock.expectOne('api/Orders/ScheduleOrders');
    request.flush(errorMessage, mockError);
    expect(errResponse).toBe(errorMessage);
  });

  it('#completeOrder should return the completed order from observable or Error', () => {
    let httpMock: HttpTestingController;
    const service: OrderDataService = TestBed.get(OrderDataService);
    httpMock = TestBed.get(HttpTestingController);
    const order: CompletedOrder = { orderId: 1, comments: '', asset: '', completed: new Date() };
    service.completeOrder(order)
      .subscribe(value => {
        expect(value).toEqual(order);
      });

    let request = httpMock.expectOne('api/Orders/CompleteOrder');
    expect(request.request.method).toBe("POST");
    request.flush(order);
    httpMock.verify();

    let errResponse: any;
    service.completeOrder(order)
      .subscribe(() => { }, err => {
        errResponse = err;
      });

    request = httpMock.expectOne('api/Orders/CompleteOrder');
    request.flush(errorMessage, mockError);
    expect(errResponse).toBe(errorMessage);
  });
});
