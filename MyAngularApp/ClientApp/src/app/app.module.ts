import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { BrowseOrdersComponent } from './browse-orders/browse-orders.component';
import { SearchOrdersComponent } from './search-orders/search-orders.component';
import { CompletedOrdersComponent } from './completed-orders/completed-orders.component';
import { ScheduledOrdersComponent } from './scheduled-orders/scheduled-orders.component';
import { MetaDataService } from './services/meta-data.service';
import { OrderDataService } from './services/order-data.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    NewOrderComponent,
    BrowseOrdersComponent,
    SearchOrdersComponent,
    CompletedOrdersComponent,
    ScheduledOrdersComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'new-order', component: NewOrderComponent },
      { path: 'browse-orders', component: BrowseOrdersComponent },
      { path: 'search-orders', component: SearchOrdersComponent },
      { path: 'completed-orders', component: CompletedOrdersComponent },
      { path: 'scheduled-orders', component: ScheduledOrdersComponent },
    ])
  ],
  providers: [MetaDataService, OrderDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
