import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowseOrdersComponent } from './browse-orders.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { SearchOrdersComponent } from '../search-orders/search-orders.component';

describe('BrowseOrdersComponent', () => {
  let component: BrowseOrdersComponent;
  let fixture: ComponentFixture<BrowseOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PaginationModule, FormsModule],
      declarations: [BrowseOrdersComponent],
      providers: [SearchOrdersComponent]
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
