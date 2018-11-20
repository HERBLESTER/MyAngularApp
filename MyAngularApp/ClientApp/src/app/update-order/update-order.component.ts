import { Component, OnInit } from '@angular/core';
import { OrderDataService } from '../services/order-data.service';
import { MetaDataService } from '../services/meta-data.service';
import { MetaData } from '../domain/domain';
import { Order } from '../domain/domain';
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

  routeParamsSubscription: Subscription;
  metaDataSubscription: Subscription;
  orderSubscription: Subscription;

  metaData: MetaData;
  model: Order = new Order();
  updateForm: FormGroup;
  isValid: boolean;

  get street() {
    return this.updateForm.get('street').value;
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
      .subscribe(result => this.signalOrderUpdated(this.model));
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
      notes: new FormControl(this.model.notes)
    });

    this.updateForm.controls['street'].markAsTouched();
    this.updateForm.controls['street'].updateValueAndValidity();
    this.isValid = this.updateForm.valid;
  }

  ngOnInit() {
    this.orderDataService.getOrder(this.route.snapshot.params['id'])
      .subscribe(result => this.setupForm(result));
    
    //this.routeParamsSubscription = this.route.params.subscribe(
    //  (params: any) => {
    //    this.orderDataService.getOrder(params['id']).subscribe(result => this.model = result);
    //  });

    this.metaDataSubscription = this.metaDataService.metaData.subscribe(result => this.metaData = result);
  }

  ngOnDestroy() {
    if (this.metaDataSubscription) {
      this.metaDataSubscription.unsubscribe();
    }
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }    
  }
}
