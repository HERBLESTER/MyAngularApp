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

describe('UpdateOrderComponent', () => {
  let component: UpdateOrderComponent;
  let fixture: ComponentFixture<UpdateOrderComponent>;
  let metaData: MetaData = { cities: [{ id: 1, name: 'Sarasota' }], operations: [{id: 1, name: 'Install'}], customers: [{ id: 1, name: 'Remax' }] };
  const street: string = '123 Street';
  let order: Order;

  let orderCompositeService: any;
  let signalOrderUpdated: any;
  let router = {
    navigate: jasmine.createSpy('navigate')
  }

  beforeEach(async(() => {
    order = new Order();
    order.street = street;

    const orderDataService = jasmine.createSpyObj('OrderDataService', ['getOrder', 'updateOrder']);
    const getOrder = orderDataService.getOrder.and.returnValue(of(order));
    const updateOrder = orderDataService.updateOrder.and.returnValue(of(order));

    orderCompositeService = jasmine.createSpyObj('OrderCompositeService', ['signalOrderUpdated']);
    signalOrderUpdated = orderCompositeService.signalOrderUpdated.and.returnValue(of(order));
  
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,
        ToastrModule.forRoot(),
        RouterTestingModule.withRoutes([{ path: 'update-order/:id', component: UpdateOrderComponent }])],
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

  it('should Update Order', () => {
    component.onSubmit();
    expect(signalOrderUpdated).toHaveBeenCalledWith(order);
    expect(router.navigate).toHaveBeenCalledWith(['../']);
  });

 it('should Cancel Order', () => {
    component.cancelOrder();
    expect(component.isCanceled()).toBeTruthy();
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
