import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { SearchService } from '../services/search-service.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-search-orders',
  templateUrl: './search-orders.component.html',
  styleUrls: ['./search-orders.component.css']
})
export class SearchOrdersComponent implements OnInit, OnDestroy {

  constructor(public searchService: SearchService) { }

  @Input() 
  statusFilter: number = -1;

  @Output()
  executeSearch: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  clearSearchEvent: Observable<void>;

  useSearchTerm: boolean = false;
  searchResults: string[];
  searchTerm: string = "";
  searchSubscription: Subscription;
  clearSubscription: Subscription;

  onSearch(val: string) {
    this.searchTerm = val;
    if (val.length > 2) {
      this.searchSubscription = this.searchService.searchEntries(val, this.statusFilter)
        .subscribe(results => {
          this.searchResults = results;
        });
    }
    else {
      this.clearSearchResults();
    }
  }

  clearSearch() {
    this.useSearchTerm = false;
    this.searchTerm = "";
    this.executeSearch.emit(this.searchTerm);
  }

  isSearchTermValid() {
    return this.searchTerm.length > 2
  }

  clearSearchResults() {
    if (this.searchResults && this.searchResults.length > 0) {
      this.searchResults.length = 0;
    }
  }

  search(term: string) {
    this.searchTerm = term;
    this.useSearchTerm = true;
    this.executeSearch.emit(this.searchTerm);
    this.clearSearchResults();
  }

  ngOnInit() {
    this.clearSubscription = this.clearSearchEvent.subscribe(() => this.clearSearchResults());
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    if (this.clearSubscription) {
      this.clearSubscription.unsubscribe();
    }
  }
}
