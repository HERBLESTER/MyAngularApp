import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute,  } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { OrderDataService } from '../services/order-data.service';
import { OrderCompositeService } from '../services/order-composite.service';
import { Order } from '../domain/domain';
import { Status } from '../domain/domain';

@Component({
  selector: 'app-browse-orders',
  templateUrl: './browse-orders.component.html',
  styleUrls: ['./browse-orders.component.css'],
  providers: [OrderCompositeService]
})
export class BrowseOrdersComponent implements OnInit, OnDestroy {
   constructor(public orderDataService: OrderDataService,
    public orderCompositeService: OrderCompositeService,
    public toastr: ToastrService,
    public router: Router,
     public activatedRoute: ActivatedRoute) { }

  useSearchTerm: boolean = false;
  searchTerm: string = "";

  private newOrderAddedSubscription: Subscription;
  private orderUpdatedSubscription: Subscription;
  private scheduleOrdersSubscription: Subscription;
  public orderSubscription: Subscription;
  clearSearch: Subject<void> = new Subject<void>();

  public showDetail: boolean = false;
  private thisRoute: string = "";

  public Status = Status;
  public orders: Order[];
  public newOrderAdded: boolean = false;
  public selectedRow: Number;
  public loading = false;

  orderCount = 0;
  currentPage = 1;
  maxSize: number = 0;
  statusFilter: number = -1;

  ngOnDestroy(): void {
    if (this.orderSubscription)
      this.orderSubscription.unsubscribe();
    if (this.newOrderAddedSubscription)
      this.newOrderAddedSubscription.unsubscribe();
    if (this.orderUpdatedSubscription)
      this.orderUpdatedSubscription.unsubscribe();
    if (this.scheduleOrdersSubscription)
      this.scheduleOrdersSubscription.unsubscribe();
  }


  executeSearch(term: string) {
    this.searchTerm = term;
    this.useSearchTerm = term && term.length > 0;
    this.fetchPage(1);
  }

  completeOrder(orderId: number, event, index) {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate([this.thisRoute, { outlets: { 'detail': ['complete-order', orderId] } }]);

    this.selectedRow = index;
  }

  fetchPage(page: number) {
    this.loading = true;
    let term: string = "";

    if (this.useSearchTerm) {
      term = this.searchTerm;
    }

    this.orderSubscription =
      this.orderDataService.getPagedOrders(page, this.statusFilter, term)
      .subscribe(result => {
        this.setPagedOrders(page, result);
        this.loading = false;
        }, err => {
          this.toastr.error('Could not Retrieve Orders!', err);
          this.loading = false;
        });
  }

  ngOnInit() {
    this.thisRoute = this.router.url;
    this.fetchPage(1);
    
    this.newOrderAddedSubscription =
      this.orderCompositeService.newOrderSignal
        .subscribe(order => {
          this.statusFilter = Status.Received;
          this.fetchPage(1);
        });

    this.orderUpdatedSubscription = this.orderCompositeService.updatedOrderSignal.subscribe(order => this.updateOrder(order));
  }

  onStatusFilterChanged(status: number) {
    if (status != this.statusFilter) {
      this.statusFilter = status;
      this.clearSearch.next();
      this.fetchPage(1);
    }
  }

  pageChanged(event: any): void {
    this.fetchPage(event.page);
  }

  scheduleOrders() {
    this.loading = true;

    this.scheduleOrdersSubscription =
      this.orderDataService.scheduledOrders()
      .subscribe(result => {
        this.statusFilter = Status.Scheduled;
        this.toastr.success(`Scheduled ${result} Orders!`);
        this.fetchPage(1);
        },
          err => {
            this.toastr.error('Schedule Orders Failed! A Partial Update may have occurred', err);
            this.loading = false;
          }
        );
  }

  public setClickedRow(index: number, orderId: number) {
    this.selectedRow = index;
    this.router.navigate([this.thisRoute, { outlets: { 'detail': ['update-order', orderId] } }]);
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
    this.router.navigate([this.thisRoute, { outlets: { 'detail': ['new-order'] } }]);
  }

  updateOrder(order: Order) {
    const index: number = this.orders.findIndex(o => o.id === order.id);
    if (index !== -1)
      this.orders.splice(index, 1, order);
  }

}
