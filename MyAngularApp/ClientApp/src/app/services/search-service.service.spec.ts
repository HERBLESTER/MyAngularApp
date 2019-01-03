import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { SearchService } from './search-service.service';

function getBaseUrl() {
  return '';
}
const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

describe('SearchServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [HttpClient, HttpHandler, providers]
  }));


  it('should be created', () => {
    const service: SearchService = TestBed.get(SearchService);
    expect(service).toBeTruthy();
  })
});
