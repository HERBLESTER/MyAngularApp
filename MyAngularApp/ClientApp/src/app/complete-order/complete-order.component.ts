import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NgForm, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, CanDeactivate } from '@angular/router';

import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { OrderDataService } from '../services/order-data.service';
import { OrderCompositeService } from '../services/order-composite.service';

import { CompletedOrder } from '../domain/domain';
import { Order } from '../domain/domain';
import { Status } from '../domain/domain';

@Component({
  selector: 'app-complete-order',
  templateUrl: './complete-order.component.html',
  styleUrls: ['./complete-order.component.css']
})
export class CompleteOrderComponent implements OnInit, OnDestroy {

  constructor(public orderDataService: OrderDataService,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private orderCompositeService: OrderCompositeService,
    private formBuilder: FormBuilder) { }

  model: CompletedOrder;
  form: FormGroup;
  order: Order;
  submitted = false;
  orderSubscription: Subscription;
  orderFetchSubscription: Subscription;
  Status = Status;

  ngOnInit() {
    const id: number = this.route.snapshot.params['id'];

    this.orderFetchSubscription = this.orderDataService.getOrder(id)
      .subscribe(result => this.setupForm(result), err => this.toastr.error('Order Fetch Failed!', err));
  }

  setupForm(order: Order) {
    this.order = order;
    this.model = <CompletedOrder>{};
    this.model.orderId = this.order.id;
    this.model.completed = new Date();

    this.form = new FormGroup({
      completionDate: new FormControl(this.model.completed, Validators.required),
      comments: new FormControl(),
      asset: new FormControl()
    });
  }

  onCancel() {
    this.router.navigate(['../']);
  }

  get completed() {
    return this.form.get('completionDate').value;
  }

  onSubmit() {
    this.submitted = true;
    this.model.completed = this.completed;
    this.model.comments = this.form.get('comments').value;
    this.model.asset = this.form.get('asset').value;

    this.orderSubscription = this.orderDataService.completeOrder(this.model)
      .subscribe(result => {
        this.orderFetchSubscription = this.orderDataService.getOrder(result.orderId)
          .subscribe(
            result => this.signalOrderUpdated(result),
            err => this.toastr.error('Order Refresh Failed!', err));
      }, err => this.toastr.error('Order Completion Failed!', err));
  }

  signalOrderUpdated(order: Order) {
    this.orderCompositeService.signalOrderUpdated(order)
    this.toastr.success('Order Completed!', 'Success!');
    this.router.navigate(['../']);
  }

  ngOnDestroy() {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }

    if (this.orderFetchSubscription) {
      this.orderFetchSubscription.unsubscribe();
    }
  }
}


