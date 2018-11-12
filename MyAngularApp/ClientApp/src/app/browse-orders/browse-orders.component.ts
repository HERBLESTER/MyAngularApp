import { Component, OnInit, Inject } from '@angular/core';
import { OrderDataService } from '../services/order-data.service';

@Component({
  selector: 'app-browse-orders',
  templateUrl: './browse-orders.component.html',
  styleUrls: ['./browse-orders.component.css']
})
export class BrowseOrdersComponent implements OnInit {

  constructor(public orderDataService: OrderDataService) { }

  ngOnInit() {
    this.orderDataService.getOrders();
  }
}
