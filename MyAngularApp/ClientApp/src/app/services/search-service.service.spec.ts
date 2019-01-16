import { TestBed, inject } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule  } from '@angular/common/http/testing';
import { SearchService } from './search-service.service';

function getBaseUrl() {
  return '';
}
const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

describe('SearchServiceService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [providers, SearchService]
  }));

  const errorMessage = 'Something bad happened; please try again later.';
  const mockError = { status: 500, statusText: 'Bad Request' };

  it('should be created', () => {
    const service: SearchService = TestBed.get(SearchService);
    expect(service).toBeTruthy();
  });
  
  it('#searchEntries should return searchTerms from observable or Error', () => {
    let httpMock: HttpTestingController;
    const searchTerms: string[] = ['a', 'b', 'c'];
    const service: SearchService = TestBed.get(SearchService);
    httpMock = TestBed.get(HttpTestingController);
    service.searchEntries('term', 1)
      .subscribe(value => {
        expect(value).toEqual(searchTerms);
      });

    let request = httpMock.expectOne('api/Orders/GetSearchList?searchInput=term&status=1');
    expect(request.request.method).toBe("GET");
    request.flush(searchTerms);
    httpMock.verify();

    let errResponse: any;
    service.searchEntries('term', 1)
      .subscribe(() => { }, err => {
        errResponse = err;
      });

    request = httpMock.expectOne('api/Orders/GetSearchList?searchInput=term&status=1');
    request.flush(errorMessage, mockError);
    request = httpMock.expectOne('api/Orders/GetSearchList?searchInput=term&status=1');
    request.flush(errorMessage, mockError);
    //retry
    expect(errResponse).toBe(errorMessage);
  });
});
