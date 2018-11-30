import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderDataService } from '../services/order-data.service';
import { MetaDataService } from '../services/meta-data.service';
import { MetaData } from '../domain/domain';
import { Order } from '../domain/domain';
import { Status } from '../domain/domain';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, CanDeactivate } from '@angular/router';
import { OrderCompositeService } from '../services/order-composite.service';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.css'],

})
export class UpdateOrderComponent implements OnInit, OnDestroy {

  constructor(public orderDataService: OrderDataService,
    public metaDataService: MetaDataService,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private orderCompositeService: OrderCompositeService,
    private formBuilder: FormBuilder) { }

  submitted = false;

  metaDataSubscription: Subscription;
  orderSubscription: Subscription;
  orderFetchSubscription: Subscription;
  paramSubscription: Subscription;

  metaData: MetaData;
  model: Order;
  updateForm: FormGroup;

  get street() {
    return this.updateForm.get('street').value;
  }
  
  isCanceled(): boolean {
    return this.model && this.model.status && this.model.status === Status.Cancelled;
  }

  isCompleted(): boolean {
    return this.model && this.model.status && this.model.status === Status.Completed;
  }

  cancelOrder() {
    this.model.status = Status.Cancelled;
    this.updateForm.get('status').setValue(Status[this.model.status]);
  }

  onCancel() {
    this.router.navigate(['../']);
  }

  onSubmit() {
    this.submitted = true;
    this.model.cityId = this.updateForm.get('city').value;
    this.model.customerId = this.updateForm.get('customer').value;
    this.model.operationId = this.updateForm.get('operation').value;
    this.model.street = this.street;
    this.model.notes = this.updateForm.get('notes').value;

    this.orderSubscription = this.orderDataService.updateOrder(this.model)
      .subscribe(result => this.signalOrderUpdated(result), err => this.toastr.error('Order Update Failed!', err));
  }

  signalOrderUpdated(order: Order) {
    this.orderCompositeService.signalOrderUpdated(order);
    this.toastr.success('Order Updated!', 'Success!');
    this.router.navigate(['../']);
  }

  setupForm(order: Order) {
    this.model = order;
    this.updateForm = new FormGroup({
      customer: new FormControl(this.model.customerId, { validators: [Validators.required] }),
      city: new FormControl(this.model.cityId, { validators: [Validators.required] }),
      operation: new FormControl(this.model.operationId, { validators: [Validators.required] }),
      street: new FormControl(this.model.street, { validators: [Validators.required, Validators.minLength(4)] }),
      notes: new FormControl(this.model.notes),
      status: new FormControl(Status[this.model.status])
    });
  }

  ngOnInit() {

    this.paramSubscription = this.route.paramMap.subscribe(p => {
      const id: number = +p.get("id");
      console.log('id', id);
      this.orderFetchSubscription = this.orderDataService.getOrder(id)
        .subscribe(result => this.setupForm(result)), err => this.toastr.error('Order Fetch Failed!', err);
    });

    this.metaDataSubscription =
      this.metaDataService.metaData.subscribe(
      result => this.metaData = result,
      err => this.toastr.error('Metadata fetch Failed!', err));
  }

  ngOnDestroy() {
    if (this.metaDataSubscription) {
      this.metaDataSubscription.unsubscribe();
    }
    if (this.orderFetchSubscription) {
      this.orderFetchSubscription.unsubscribe();
    }
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }
}
