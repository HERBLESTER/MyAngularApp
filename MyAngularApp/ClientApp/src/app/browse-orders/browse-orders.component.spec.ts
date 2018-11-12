import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseOrdersComponent } from './browse-orders.component';

describe('BrowseOrdersComponent', () => {
  let component: BrowseOrdersComponent;
  let fixture: ComponentFixture<BrowseOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
