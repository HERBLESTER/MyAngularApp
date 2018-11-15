import { Component, OnInit, Directive } from '@angular/core';
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

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {
  constructor(public orderDataService: OrderDataService, public metaDataService: MetaDataService) { }

  submitted = false;

  subscription: Subscription;
  metaData: MetaData;

  //cities: City[];
  //customers: Customer[];
  //operations: Operation[];
  model: Order;
  
  onSubmit() {
    this.submitted = true;
  
    this.orderDataService.newOrder(this.model);
    this.model = new Order();
  }

  ngOnInit() {
    this.subscription = this.metaDataService.metaData.subscribe(result => this.metaData = result);

    //this.metaDataService.metaData.subscribe(result => this.operations = result.operations);
    //this.metaDataService.metaData.subscribe(result => this.cities = result.cities);
    //this.metaDataService.metaData.subscribe(result => this.customers = result.customers);
    this.model = new Order();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }
}
