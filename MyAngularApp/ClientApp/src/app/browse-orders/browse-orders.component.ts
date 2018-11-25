import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { OrderDataService } from '../services/order-data.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { Subscription, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { OrderCompositeService } from '../services/order-composite.service';
import { UtilitiesService } from '../services/utilities.service';
import { SearchService } from '../services/search-service.service';

import { Order } from '../domain/domain';
import { Status } from '../domain/domain';

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
    public router: Router,
    public searchService: SearchService) {

    this.searchService.getSearchTerms(this.searchTerm$)
      .subscribe(results => {
        this.results = results;
      });
  }

  selectSearchTerm(term: string) {

  }

  results: string[];
  searchTerm$ = new Subject<string>();

  private detailStateSubscription: Subscription;
  private newOrderAddedSubscription: Subscription;
  private orderUpdatedSubscription: Subscription;
  private scheduleOrdersSubscription: Subscription;
  public orderSubscription: Subscription;

  public showDetail: boolean = false;

  public Status = Status;
  public orders: Order[];
  public newOrderAdded: boolean = false;
  public selectedRow: Number;
  public loading = false;

  orderCount = 0;
  currentPage = 1;
  maxSize: number = 0;
  statusFilter: number = -1;

  fetchPage(page: number) {
    this.loading = true;

    this.orderSubscription =
      this.orderDataService.getPagedOrders(page, this.statusFilter)
      .subscribe(result => {
        this.setPagedOrders(page, result);
        this.loading = false;
        }, err => {
          this.toastr.error('Could not Retrieve Orders!', err);
          this.loading = false;
        });
  }

  ngOnInit() {
    this.fetchPage(1);

    this.detailStateSubscription = this.orderCompositeService.detailState.
      subscribe(state => this.setDetailClosed());
    
    this.newOrderAddedSubscription =
      this.orderCompositeService.newOrderSignal
        .subscribe(order => {
          //this.orders.unshift(order)
          this.statusFilter = Status.Received;
          this.fetchPage(1);
        });

    this.orderUpdatedSubscription = this.orderCompositeService.updatedOrderSignal.subscribe(order => this.updateOrder(order));
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
    if (this.scheduleOrdersSubscription)
      this.scheduleOrdersSubscription.unsubscribe();
  }

  onStatusFilterChanged(status: number) {
    this.statusFilter = status;
    this.fetchPage(1);
  }

  pageChanged(event: any): void {
    this.fetchPage(event.page);
  }

  scheduleOrders() {
    this.loading = true;

    this.scheduleOrdersSubscription =
      this.orderDataService.scheduledOrders()
        .subscribe(result => {
          this.loading = false;
          this.toastr.success(`Scheduled ${result} Orders!`);
        },
          err => {
            this.toastr.error('Schedule Orders Failed! A Partial Update may have occurred', err);
            this.loading = false;
          }
        );
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

  private setDetailClosed() {
    this.showDetail = false;
  }

  private setPagedOrders(page: number, orders: Order[]) {
    this.currentPage = page;
    this.orders = orders;
    if (orders.length > 0) {
      this.orderCount = orders[0].orderCount;
    }
    else {
      this.orderCount = 0;
      this.toastr.info('No Orders Retrieved')
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

  updateOrder(order: Order) {
    const index: number = this.orders.findIndex(o => o.id === order.id);
    if (index !== -1)
      this.orders.splice(index, 1, order);
  }

}
