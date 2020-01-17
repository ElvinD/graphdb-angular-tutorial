import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SparqlService {

  static PREFIXES = `
  PREFIX hg: <http://rdf.histograph.io/>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX imt: <http://immigrants.tutorial/>
  PREFIX pnv: <https://w3id.org/pnv#>`;

  serviceURL = 'http://localhost:7200/repositories/tutorial';



  constructor(
    private http: HttpClient
  ) { }

  getRDF(query: string): Observable<any[]> {
    const params = new HttpParams()
    .set('query', query)
    .set('format', 'json');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/sparql-results+json'
      }),
      params: params
    };
    return this.http.get<any>(this.serviceURL, options).pipe(
      catchError(this.handleError('getRDF', []))
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
    console.log(`SparqlService: ${message}`, data);
  }
}
