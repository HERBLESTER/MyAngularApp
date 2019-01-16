import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Observable } from 'rxjs/Observable';
import { catchError, retry  } from 'rxjs/operators';
import { Order } from '../domain/domain';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  searchEntries(term: string, status: number): Observable<string[]> {
      const params = new HttpParams()
        .set('searchInput', term.toString())
        .set('status', status.toString());

      return this.http.get<string[]>(this.baseUrl + 'api/Orders/GetSearchList', { params })
        .pipe(
          retry(1),
          catchError(ErrorHandlerService.handleError));
  }
}
