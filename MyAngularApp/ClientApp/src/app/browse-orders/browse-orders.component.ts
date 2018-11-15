import { Component, OnInit, Inject } from '@angular/core';
import { OrderDataService } from '../services/order-data.service';
import { Order } from '../domain/domain';
import { Status } from '../domain/domain';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-browse-orders',
  templateUrl: './browse-orders.component.html',
  styleUrls: ['./browse-orders.component.css']
})
export class BrowseOrdersComponent implements OnInit {

  constructor(public orderDataService: OrderDataService) { }

  public Status = Status;
  public orders: Observable<Order[]>;

  ngOnInit() {
    this.orders = this.orderDataService.getOrders();
  }
}
