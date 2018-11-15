import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MetaData } from '../domain/domain';
import { Observable } from 'rxjs/Observable';
import { ErrorHandlerService } from '../services/error-handler.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MetaDataService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
   this.metaData = this.fetchMetadata();
  }

  public metaData: Observable<MetaData>;

  fetchMetadata() {
    return this.http.get<MetaData>(this.baseUrl + 'api/metadata/getmetadata')
      .pipe(catchError(ErrorHandlerService.handleError));
  }
}
