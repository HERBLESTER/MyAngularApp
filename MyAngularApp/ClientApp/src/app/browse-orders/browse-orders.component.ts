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
  {
   this.detailStateSubscription = this.orderCompositeService.detailState.
      subscribe(state =>
        this.showDetail = state);
  }

  private detailStateSubscription: Subscription;
  public detailTitle: string = "New Order"
  public showDetail: boolean = false;

// private newOrderLink: string = '[routerLink] = "[{ outlets: { detail: ['new-order'] } }]"';
  public Status = Status;
  public orders: Observable<Order[]>;
  
 public showNewOrder() {
   this.showDetail = true;
   this.router.navigateByUrl(this.router.url + '/(detail:new-order)');
  }

  ngOnInit() {
    this.orders = this.orderDataService.getOrders();
  }

  ngOnDetroy() {
    if (this.detailStateSubscription)
      this.detailStateSubscription.unsubscribe();
  }
}
