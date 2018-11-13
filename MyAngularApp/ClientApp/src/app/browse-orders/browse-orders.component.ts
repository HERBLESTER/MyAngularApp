import { Component, OnInit, Inject } from '@angular/core';
import { OrderDataService } from '../services/order-data.service';
import { Order } from '../domain/domain';
import { Status } from '../domain/domain';
import { TypeofExpr } from '@angular/compiler';

@Component({
  selector: 'app-browse-orders',
  templateUrl: './browse-orders.component.html',
  styleUrls: ['./browse-orders.component.css']
})
export class BrowseOrdersComponent implements OnInit {

  constructor(public orderDataService: OrderDataService) { }

  public Status = Status;
  public orders: Order[];

  ngOnInit() {
    this.orderDataService.getOrders().subscribe(result => {
      this.orders = result;
    }, error => console.error(error));;
  }
}
