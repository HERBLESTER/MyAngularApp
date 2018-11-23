import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { OrderDataService } from '../services/order-data.service';
import { Order } from '../domain/domain';
import { Status } from '../domain/domain';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { OrderCompositeService } from '../services/order-composite.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-browse-orders',
  templateUrl: './browse-orders.component.html',
  styleUrls: ['./browse-orders.component.css'],
  providers: [OrderCompositeService]
})
export class BrowseOrdersComponent implements OnInit {

  constructor(public orderDataService: OrderDataService,
    public orderCompositeService: OrderCompositeService,
    public toastr: ToastrService,
    private utilities: UtilitiesService,
    public router: Router)
  {  }

  private detailStateSubscription: Subscription;
  private newOrderAddedSubscription: Subscription;
  private orderUpdatedSubscription: Subscription;

  public showDetail: boolean = false;

  public Status = Status;
  public orderSubscription: Subscription;
  public orders: Order[];
  public newOrderAdded: boolean = false;
  public selectedRow: Number;

  schedulOrders() {

  }

  public setClickedRow(index: number, orderId: number) {
    this.selectedRow = index;
    this.showDetail = true;
    if (this.router.url.indexOf('update-order') !== -1) {
      this.orderCompositeService.signalOrderSelected(this.orders[index]);
    }
    else {
      if (this.router.url.indexOf('detail') !== -1) {
        this.router.navigate([this.utilities.getParentRoute(this.router.url)])
          .then(_ => this.router.navigateByUrl(this.router.url + '/(detail:update-order/' + orderId + ')'));
      }
      else {
        this.router.navigateByUrl(this.router.url + '/(detail:update-order/' + orderId + ')');
      }
    }
  }

  public showNewOrder() {
    this.showDetail = true;
    if (this.router.url.indexOf('detail') !== -1) {
      this.router.navigate([this.utilities.getParentRoute(this.router.url)])
        .then(_ => this.router.navigateByUrl(this.router.url + '/(detail:new-order)'));
    }
    else {
      this.router.navigateByUrl(this.router.url + '/(detail:new-order)');
    }
  }

  private setDetailClosed() {
    this.showDetail = false;
  }

  ngOnInit() {
    this.orderSubscription =
      this.orderDataService.getOrders()
      .subscribe(result => this.orders = result, err => this.toastr.error('Could not Retrieve Orders!', err));

    this.detailStateSubscription = this.orderCompositeService.detailState.
      subscribe(state => this.setDetailClosed());
    
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
    if (this.orderUpdatedSubscription)
      this.orderUpdatedSubscription.unsubscribe();
  }
}
