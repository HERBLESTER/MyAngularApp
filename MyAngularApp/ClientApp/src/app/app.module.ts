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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    NewOrderComponent,
    BrowseOrdersComponent,
    SearchOrdersComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: 'browse-orders', component: BrowseOrdersComponent,
        children: [
          { path: 'new-order', component: NewOrderComponent, outlet: "detail" },
          { path: 'update-order/:id', component: NewOrderComponent, outlet: "detail" }]
      },
      { path: '', redirectTo: '/browse-orders', pathMatch: 'full'}
    ], { enableTracing: true })
  ],
  providers: [MetaDataService, OrderDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
