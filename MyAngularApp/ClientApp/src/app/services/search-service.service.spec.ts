import { TestBed } from '@angular/core/testing';

import { SearchService } from './search-service.service';

describe('SearchServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchService = TestBed.get(SearchService);
    expect(service).toBeTruthy();
  });
});
