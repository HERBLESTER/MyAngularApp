import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchService } from '../services/search-service.service';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ErrorHandlerService } from '../services/error-handler.service';
import { catchError, retry } from 'rxjs/operators';

import { Subscription, Observable } from 'rxjs';

import { SearchOrdersComponent } from './search-orders.component';

describe('SearchOrdersComponent', () => {
  let component: SearchOrdersComponent;
  let fixture: ComponentFixture<SearchOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchOrdersComponent],
      providers: [SearchService, HttpClient]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOrdersComponent);
    component = fixture.componentInstance;
    component.statusFilter = -1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
