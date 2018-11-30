import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { OrderDataService } from '../services/order-data.service';
import { MetaDataService } from '../services/meta-data.service';
import { MetaData } from '../domain/domain';
import { Order } from '../domain/domain';
import { Status } from '../domain/domain';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, CanDeactivate } from '@angular/router';
import { OrderCompositeService } from '../services/order-composite.service';
import { NgForm } from '@angular/forms';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    if (component.canDeactivate()) {
      return true;
    } else {
      confirm('You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
    }
  }
}

@Component({
  selector: 'app-order-detail',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit, ComponentCanDeactivate, OnDestroy {
  constructor(
    public orderDataService: OrderDataService,
    public metaDataService: MetaDataService,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private orderCompositeService: OrderCompositeService) { }

  @ViewChild('orderForm') public userFrm: NgForm;

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return !this.userFrm.dirty;
  }

  submitted = false;
  error: any;

  metaDataSubscription: Subscription;
  orderDataSubscription: Subscription;
  metaData: MetaData;
  model: Order;

  onCancel() {
    this.router.navigate(['../']);
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    this.orderDataSubscription = this.orderDataService.newOrder(this.model)
        .subscribe(result =>
        this.processNewOrder(result), err => this.toastr.error('Order Creation Failed!', err));
  }

  processNewOrder(order: Order) {
    this.orderCompositeService.signalNewOrderAdded(order);
    this.toastr.success('Order Added!', 'Success!');

    this.model = new Order();
  }

  ngOnInit() {
    this.metaDataSubscription = this.metaDataService.metaData.subscribe(result => this.metaData = result);
    this.model = new Order();
  }

  ngOnDestroy() {
    if (this.metaDataSubscription) {
      this.metaDataSubscription.unsubscribe();
    }

    if (this.orderDataSubscription) {
      this.orderDataSubscription.unsubscribe();
    }
  }
}
