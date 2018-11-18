import { Component, OnInit, Directive, Output, EventEmitter } from '@angular/core';
import { OrderDataService } from '../services/order-data.service';
import { MetaDataService } from '../services/meta-data.service';
import { MetaData } from '../domain/domain';
import { City } from '../domain/domain';
import { Operation } from '../domain/domain';
import { Customer } from '../domain/domain';
import { Order } from '../domain/domain';
import { Status } from '../domain/domain';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderCompositeService } from '../services/order-composite.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {
  constructor(
    private utilities: UtilitiesService,
    public orderDataService: OrderDataService,
    public metaDataService: MetaDataService,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private orderCompositeService: OrderCompositeService) { }

  submitted = false;

  subscription: Subscription;
  metaData: MetaData;
  model: Order;

  onCancel() {
    this.router.navigate([this.utilities.getParentRoute(this.router.url)], { relativeTo: this.route });
    this.orderCompositeService.setDetailState(false);
  }

  onSubmit() {
    this.submitted = true;
  
    this.orderDataService.newOrder(this.model)
      .subscribe(result =>
        this.orderCompositeService.signalNewOrderAdded(result));

    this.toastr.success('Order Added!', 'Success!');
    ;

    this.model = new Order();
  }

  ngOnInit() {
    this.subscription = this.metaDataService.metaData.subscribe(result => this.metaData = result);
    this.model = new Order();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
