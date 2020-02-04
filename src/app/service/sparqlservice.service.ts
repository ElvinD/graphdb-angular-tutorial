import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

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

  protected parseResults(results: any): Array<RDFData> {

    let resultData: any;
    const tempDict: { [uri: string]: RDFData } = {};
    const itemsDict: { [uri: string]: RDFData } = {};
    const items: RDFData[] = [];
    let rdfdata: RDFData;
    let key: string;
    let label: string;
    let hits: number;
    let type: string;
    for (let i = 0; i < results['results']['bindings'].length; i++) {
      resultData = results['results']['bindings'][i];
      key = resultData['uri'] ? resultData['uri']['value'] : null;
      label = resultData['label'] ? resultData['label']['value'] : null;
      hits = resultData['hits'] ? resultData['hits']['value'] : null;
      type = resultData['type'] ? resultData['type']['value'] : null;
      if (null == tempDict[key]) {
        rdfdata = new RDFData();
        tempDict[key] = rdfdata;
      } else {
        rdfdata = tempDict[key];
      }
      rdfdata.uri = key;
      rdfdata.hits = hits;
      rdfdata.label = label;
      rdfdata.type = type;
      if (rdfdata.label && rdfdata.label !== '') {
        if (itemsDict[rdfdata.uri] == null) {
          itemsDict[rdfdata.uri] = rdfdata;
          items.push(rdfdata);
        } else {
          // console.log('Duplicate item found: ', itemdata);
        }
      } else {
        // console.log('Item without a name found: ', itemdata);
      }
    }
    return items;
  }


  getProvinces() {
    let query = `
        ${SparqlService.PREFIXES}
        select ?uri ?label ?type (count(?residents) as ?hits)  where {
        ?uri dct:type hg:Province ;
        rdf:type ?type ;
        rdfs:label ?label .
        ?place hg:liesIn ?uri .
        ?residents dbo:residence ?place
        }
        group by ?uri ?label ?type
        order by desc(?hits)`;

    return this.getRDF(query).pipe(
      map(res => {
        return this.parseResults(res);
      }));
  }

  getPlaces(provinces: RDFData[]) {
    let query = `
          ${SparqlService.PREFIXES}
          select distinct ?uri ?name (count(?residents) as ?hits) ?province where {
            ?uri dct:type hg:Place ;
            rdfs:label ?name .
            ?residents dbo:residence ?uri .
            ${provinces.map(province => `?uri hg:liesIn <${province.uri}> .`).join(' ')}
            ?uri hg:liesIn ?province
          }
          group by ?uri ?name ?province
          order by desc(?hits)`;

    return this.getRDF(query).pipe(
      map(res => {
        return this.parseResults(res);
      }));
  }
}

export class RDFData {
  label: string;
  uri: string;
  type: string;
  template: string;
  templateRole: string;
  hits?: number;
  selected = false;
}
