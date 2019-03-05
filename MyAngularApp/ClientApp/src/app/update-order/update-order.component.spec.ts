import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateOrderComponent } from './update-order.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderDataService } from '../services/order-data.service';
import { of } from 'rxjs';
import { MetaData, Order, Status } from '../domain/domain';
import { MetaDataService } from '../services/meta-data.service';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderCompositeService } from '../services/order-composite.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MetaDataServiceStub } from '../../testing/metadata-service-stub';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UpdateOrderComponent', () => {
  let component: UpdateOrderComponent;
  let fixture: ComponentFixture<UpdateOrderComponent>;
  let metaData: MetaData = { cities: [{ id: 1, name: 'Sarasota' }], operations: [{ id: 1, name: 'Install' }], customers: [{ id: 1, name: 'Remax' }] };
  const street: string = '123 Street';
  let order: Order;

  let orderCompositeService: any;
  let signalOrderUpdated: any;
  let updateOrder: any;

  let router = {
    navigate: jasmine.createSpy('navigate')
  }

  beforeEach(async(() => {
    order = new Order();
    order.street = street;
    order.cityId = metaData.cities[0].id;
    order.cityName = metaData.cities[0].name;
    order.customerId = metaData.customers[0].id;
    order.customerName = metaData.customers[0].name;
    order.operationId = metaData.operations[0].id;
    order.operationName = metaData.operations[0].name;
    order.dateReceived = new Date();
    order.id = 1;
    order.notes = 'a note';

    const orderDataService = jasmine.createSpyObj('OrderDataService', ['getOrder', 'updateOrder']);
    const getOrder = orderDataService.getOrder.and.returnValue(of(order));
    updateOrder = orderDataService.updateOrder.and.returnValue(of(order));

    orderCompositeService = jasmine.createSpyObj('OrderCompositeService', ['signalOrderUpdated']);
    signalOrderUpdated = orderCompositeService.signalOrderUpdated.and.returnValue(of(order));

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,
        ToastrModule.forRoot(),
        RouterTestingModule.withRoutes([{ path: 'update-order/:id', component: UpdateOrderComponent }]),
        BrowserAnimationsModule],
      declarations: [UpdateOrderComponent],
      providers: [
        { provide: OrderDataService, useValue: orderDataService },
        { provide: MetaDataService, useValue: new MetaDataServiceStub(of(metaData)) },
        { provide: OrderCompositeService, useValue: orderCompositeService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({ id: 1 }) },
        { provide: Router, useValue: router }
      ]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpdateOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect the order', () => {
    const updateElement: HTMLElement = fixture.nativeElement;
    let inputElement: HTMLInputElement = updateElement.querySelector('#status');
    expect(inputElement.value).toEqual(Status[Status.Received]);

    let selectElement: HTMLSelectElement = updateElement.querySelector('#customer');
    expect(selectElement.value).toEqual(order.customerId.toString());

    selectElement = updateElement.querySelector('#city');
    expect(selectElement.value).toEqual(order.cityId.toString());

    selectElement = updateElement.querySelector('#operation');
    expect(selectElement.value).toEqual(order.operationId.toString());

    inputElement = updateElement.querySelector('#street');
    expect(inputElement.value).toEqual(order.street);

    let textAreaElement: HTMLTextAreaElement = updateElement.querySelector('#notes');
    expect(textAreaElement.value).toEqual(order.notes);

    let buttonElement: HTMLButtonElement = updateElement.querySelector('#submit');
    expect(buttonElement.disabled).toBeFalsy();

    buttonElement = updateElement.querySelector('#cancelOrder');
    expect(buttonElement.disabled).toBeFalsy();

  });

  it('should Update Order', () => {
    order.street = '199 First Avenue';
    const updateElement: HTMLElement = fixture.nativeElement;
    let inputElement: HTMLInputElement = updateElement.querySelector('#street');
    inputElement.value = order.street;
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    let buttonElement: HTMLButtonElement = updateElement.querySelector('#submit');
    buttonElement.click();

    expect(updateOrder).toHaveBeenCalledWith(order);
    expect(signalOrderUpdated).toHaveBeenCalledWith(order);
    expect(router.navigate).toHaveBeenCalledWith(['../']);
  });

  it('should Cancel Order', () => {
    const updateElement: HTMLElement = fixture.nativeElement;
    let buttonElement: HTMLButtonElement = updateElement.querySelector('#cancelOrder');
    buttonElement.click();
    expect(component.isCanceled()).toBeTruthy();
    let inputElement: HTMLInputElement = updateElement.querySelector('#status');
    expect(inputElement.value).toEqual(Status[Status.Cancelled]);
    fixture.detectChanges();

    buttonElement = updateElement.querySelector('#cancelOrder');
    expect(buttonElement.disabled).toBeTruthy();

  });

  it('should validate street', () => {
    const updateElement: HTMLElement = fixture.nativeElement;
    let inputElement: HTMLInputElement = updateElement.querySelector('#street');
    inputElement.value = '123';
    inputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    let divElement: HTMLDivElement = updateElement.querySelector('#streetMinLength');
    expect(divElement.textContent).toEqual('Street must be at least 4 characters long.');

    inputElement.value = '';
    inputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    divElement = updateElement.querySelector('#streetRequired');
    expect(divElement.textContent).toEqual('Street is required.');

  });

  it('should navigate on Cancel', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['../']);
  });

  it('should return street', () => {
    expect(component.street).toEqual(order.street);
  });

  it('should be not be Cancelled', () => {
    expect(component.isCanceled()).toBeFalsy();
  });

  it('should be not be Completed', () => {
    expect(component.isCompleted()).toBeFalsy();
  });

});
