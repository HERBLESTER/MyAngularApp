import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { OrderDataService } from '../services/order-data.service';
import { Order } from '../domain/domain';
import { Status } from '../domain/domain';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { OrderCompositeService } from '../services/order-composite.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-browse-orders',
  templateUrl: './browse-orders.component.html',
  styleUrls: ['./browse-orders.component.css'],
  providers: [OrderCompositeService]
})
export class BrowseOrdersComponent implements OnInit {

  constructor(public orderDataService: OrderDataService,
    public orderCompositeService: OrderCompositeService,
    public router: Router)
  {  }

  private detailStateSubscription: Subscription;
  private newOrderAddedSubscription: Subscription;
  private orderUpdatedSubscription: Subscription;

  public detailTitle: string;
  public showDetail: boolean = false;

// private newOrderLink: string = '[routerLink] = "[{ outlets: { detail: ['new-order'] } }]"';
  public Status = Status;
  public orderSubscription: Subscription;
  public orders: Order[];
  public newOrderAdded: boolean = false;
  public  selectedRow: Number;
  
  public setClickedRow = function (index) {
  this.selectedRow = index;
}

  displayOrderForUpdae(orderId: number) {
    this.detailTitle = "Update Order"

    this.showDetail = true;
    this.router.navigateByUrl(this.router.url + '/(detail:update-order/' + orderId +')');
  }

  public showNewOrder() {
   this.detailTitle = "New Order"
   this.showDetail = true;
   this.router.navigateByUrl(this.router.url + '/(detail:new-order)');
  }

  ngOnInit() {
    this.orderSubscription =
      this.orderDataService.getOrders()
        .subscribe(result => this.orders = result);

    this.detailStateSubscription = this.orderCompositeService.detailState.
      subscribe(state =>
        this.showDetail = state);
    
    this.newOrderAddedSubscription =
      this.orderCompositeService.newOrderSignal
        .subscribe(order => this.orders.unshift(order));

    this.orderUpdatedSubscription = this.orderCompositeService.updatedOrderSignal.subscribe(order => this.updateOrder(order));
  }

  updateOrder(order: Order) {
    const index: number = this.orders.findIndex(o => o.id === order.id);
    if (index !== -1)
      this.orders.splice(index, 1, order);
  }

  ngOnDetroy() {
    if (this.detailStateSubscription)
      this.detailStateSubscription.unsubscribe();
    if (this.orderSubscription)
      this.orderSubscription.unsubscribe();
    if (this.newOrderAddedSubscription)
      this.newOrderAddedSubscription.unsubscribe();
  }
}
