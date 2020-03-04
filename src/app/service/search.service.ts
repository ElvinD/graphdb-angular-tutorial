import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  serviceURL = 'https://nominatim.openstreetmap.org/search?';

  constructor(private http: HttpClient) { }

  search(query: string): Observable<any[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('format', 'json');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params
    };
    return this.http.get<any>(this.serviceURL, options).pipe(
      catchError(this.handleError('search ', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console

      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string, data?: any) {
    console.log(`Searchservice: ${message}`, data);
  }

}
