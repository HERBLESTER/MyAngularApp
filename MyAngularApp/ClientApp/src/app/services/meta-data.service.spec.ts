import { TestBed, inject } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MetaDataService } from './meta-data.service';
import { MetaData } from '../domain/domain';

function getBaseUrl() {
  return '';
}
const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

describe('MetaDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [providers, MetaDataService]
    });
  });

  const errorMessage = 'Something bad happened; please try again later.';
  const mockError = { status: 500, statusText: 'Bad Request' };
  const metaData: MetaData = { cities: [], operations: [], customers: []  }

  it('#Metadata should be present or error', () => {
    let httpMock: HttpTestingController;
    let service: MetaDataService = TestBed.get(MetaDataService);
    httpMock = TestBed.get(HttpTestingController);
    service.metaData
      .subscribe(value => {
        expect(value).toEqual(metaData);
      });

    let request = httpMock.expectOne('api/metadata/getmetadata');
    expect(request.request.method).toBe("GET");
    request.flush(metaData);
    httpMock.verify();

    let errResponse: any;
    service = TestBed.get(MetaDataService);
    service.metaData
      .subscribe(() => { }, err => {
        errResponse = err;
      });

    request = httpMock.expectOne('api/metadata/getmetadata');
    request.flush(errorMessage, mockError);
    expect(errResponse).toBe(errorMessage);
  });
});
