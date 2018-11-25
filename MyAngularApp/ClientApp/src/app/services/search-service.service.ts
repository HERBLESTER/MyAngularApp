import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap, retry, debounceTime, distinctUntilChanged, switchMap, skipWhile  } from 'rxjs/operators';
import { Order } from '../domain/domain';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getSearchTerms(searchInput: Observable<string>): Observable<string[]> {

    return searchInput.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => this.searchEntries(term)));
  }

  searchEntries(term: string): Observable<string[]> {
    if (term.length > 2) {
      const params = new HttpParams()
        .set('searchInput', term.toString());

      return this.http.get<string[]>(this.baseUrl + 'api/Orders/GetSearchList', { params })
        .pipe(
          retry(1),
          catchError(ErrorHandlerService.handleError));
    }
    //else {
    //  return new Observable<string[]>();
    //}
  }
}
