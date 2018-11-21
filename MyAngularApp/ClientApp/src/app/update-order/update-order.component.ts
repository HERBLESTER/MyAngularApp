import { Component, OnInit } from '@angular/core';
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
import { UtilitiesService } from '../services/utilities.service';
import { NgForm, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.css']
})
export class UpdateOrderComponent implements OnInit {

  constructor(private utilities: UtilitiesService,
    public orderDataService: OrderDataService,
    public metaDataService: MetaDataService,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private orderCompositeService: OrderCompositeService,
    private formBuilder: FormBuilder) {
    
  }

  submitted = false;

  metaDataSubscription: Subscription;
  orderSubscription: Subscription;
  orderSelectedSubscription: Subscription;

  metaData: MetaData;
  model: Order;
  updateForm: FormGroup;
  isValid: boolean;

  get street() {
    return this.updateForm.get('street').value;
  }
  
  isCanceled(): boolean {
    return this.model && this.model.status && this.model.status === Status.Cancelled;
  }
 
  cancelOrder() {
    this.model.status = Status.Cancelled;
    this.updateForm.get('status').setValue(Status[this.model.status]);
  }

  onCancel() {
    this.router.navigate([this.utilities.getParentRoute(this.router.url)]);
    this.orderCompositeService.setDetailState(false);//todo: use router listen
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
    this.orderCompositeService.signalOrderUpdated(order)
    this.orderCompositeService.setDetailState(false);
    this.toastr.success('Order Updated!', 'Success!');
    this.router.navigate([this.utilities.getParentRoute(this.router.url)]);
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

    this.updateForm.controls['street'].markAsTouched();
    this.updateForm.controls['street'].updateValueAndValidity();
    this.isValid = this.updateForm.valid;
  }

  ngOnInit() {

    const id: number = this.route.snapshot.params['id'];
    if (!this.model || !this.model.id || this.model.id !== id) {
      this.orderDataService.getOrder(this.route.snapshot.params['id'])
        .subscribe(result => this.setupForm(result), err => this.toastr.error('Order Fetch Failed!', err));
    }
    
    this.orderSelectedSubscription = this.orderCompositeService.selectedOrderSignal
      .subscribe(order => this.orderDataService.getOrder(order.id)
        .subscribe(result => this.setupForm(result)), err => this.toastr.error('Order Fetch Failed!', err));

    this.metaDataSubscription =
      this.metaDataService.metaData.subscribe(
      result => this.metaData = result,
      err => this.toastr.error('Metadata fetch Failed!', err));
  }

  ngOnDestroy() {
    if (this.metaDataSubscription) {
      this.metaDataSubscription.unsubscribe();
    }
    if (this.orderSelectedSubscription) {
      this.orderSelectedSubscription.unsubscribe();
    }
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }    
  }
}
