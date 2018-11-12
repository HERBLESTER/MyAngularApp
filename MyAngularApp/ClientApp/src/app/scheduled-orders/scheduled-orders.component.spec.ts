import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledOrdersComponent } from './scheduled-orders.component';

describe('ScheduledOrdersComponent', () => {
  let component: ScheduledOrdersComponent;
  let fixture: ComponentFixture<ScheduledOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
