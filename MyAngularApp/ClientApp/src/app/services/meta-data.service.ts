import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MetaData } from '../domain/domain';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MetaDataService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
   this.metaData = this.fetchMetadata();
  }

  public metaData: Observable<MetaData>;

  fetchMetadata() {
    return this.http.get<MetaData>(this.baseUrl + 'api/metadata/getmetadata');
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    //return throwError(
    //  'Something bad happened; please try again later.');
  };
}


//interface City {
//  id: number;
//  name: string;
//}

//interface Operation {
//  id: number;
//  name: string;
//}

//interface Customer {
//  id: number;
//  name: string;
//}

//interface MetaData {
//  cities: City[],
//  operations: Operation[],
//  customers: Customer[]
//}
