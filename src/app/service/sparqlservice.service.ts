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
    let dctype: string;
    for (let i = 0; i < results['results']['bindings'].length; i++) {
      resultData = results['results']['bindings'][i];
      key = resultData['uri'] ? resultData['uri']['value'] : null;
      label = resultData['label'] ? resultData['label']['value'] : null;
      hits = resultData['hits'] ? resultData['hits']['value'] : null;
      type = resultData['type'] ? resultData['type']['value'] : null;
      dctype = resultData['dctype'] ? resultData['dctype']['value'] : null;
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
      rdfdata.dctype = dctype;
      if (rdfdata.label && rdfdata.label !== '') {
        if (itemsDict[rdfdata.uri] == null) {
          itemsDict[rdfdata.uri] = rdfdata;
          items.push(rdfdata);
        } else {
          console.log('Duplicate item found: ', rdfdata.label);
        }
      } else {
        // console.log('Item without a name found: ', itemdata);
      }
    }
    // console.log("results from loading: ", results);
    return items;
  }

  itemsContainProvinces(items:RDFData[]):boolean {
    return items.filter (item => item.dctype  === "http://rdf.histograph.io/Province").length > 0;
  }

  itemsContainPlaces(items:RDFData[]):boolean {
    return items.filter (item => item.dctype  === "http://rdf.histograph.io/Place").length > 0;
  }

  itemsContainPeople(items:RDFData[]):boolean {
    return items.filter (item => item.type  === "https://w3id.org/pnv#Person").length > 0;
  }

  getProvinces() {
    let query = `
        ${SparqlService.PREFIXES}
        select distinct ?uri ?label ?type (count(?residents) as ?hits) ?dctype  where {
        ?uri dct:type hg:Province ;
        dct:type ?dctype ;
        rdf:type ?type ;
        rdfs:label ?label .
        ?place hg:liesIn ?uri .
        ?residents dbo:residence ?place
        }
        group by ?uri ?label ?type ?dctype
        order by desc(?hits)`;
    return this.getRDF(query).pipe(
      map(res => {
        return this.parseResults(res);
      }));
  }

  getPlaces(provinces: RDFData[]) {
    let query = `
          ${SparqlService.PREFIXES}
          select distinct ?uri ?label ?type (count(?residents) as ?hits) ?province ?dctype where {
            ?uri dct:type hg:Place ;
            rdf:type ?type ;
            dct:type ?dctype ;
            rdfs:label ?label .
            ?residents dbo:residence ?uri .
            ${provinces.map(province => `?uri hg:liesIn <${province.uri}> .`).join(' ')}
            
          }
          group by ?uri ?label ?type ?province ?dctype
          order by asc(?uri)`;
    return this.getRDF(query).pipe(
      map(res => {
        return this.parseResults(res);
      }));
  }

  getPeople(fromWhere: RDFData[]) {
    let query = `
          ${SparqlService.PREFIXES}
          select distinct ?uri ?label ?firstName ?type ?infix ?surname ?place ?province where {
            ?uri a pnv:Person ;
            a ?type ;
            rdfs:label ?label ;
            pnv:hasName ?nameURI .
            optional { ?nameURI pnv:literalName ?label } .
            optional { ?nameURI pnv:firstName ?firstName } .
            optional { ?nameURI pnv:infix ?infix } .
            optional { ?nameURI pnv:surname ?surname } .
            ${fromWhere.filter(item => this.itemsContainPlaces([item])).map(item => `?uri dbo:residence <${item.uri}> .`).join(' ')}
            ?uri dbo:residence ?residence .
            ${fromWhere.filter(item => this.itemsContainProvinces([item])).map(item => `?residence hg:liesIn <${item.uri}> .`).join(' ')}
            ?residence hg:liesIn ?province
          } limit 1000`;

          // console.log('people query: ', query);
    return this.getRDF(query).pipe(
      map(res => {
        // console.log (" people results:" , res);
        return this.parseResults(res);
      }));
  }

  getPersonDetails(who:RDFData) {
   let query = `
    ${SparqlService.PREFIXES}
    select distinct
    ?uri ?place ?nameURI ?name ?literalName ?baseSurname
    ?surname ?surnamePrefix ?firstName ?givenName
    ?patronym ?prefix ?givenNameSuffix ?infix
    ?suffix ?disambiguatingDescription ?honorificSuffixwhere
    where {
      <${who.uri}> dbo:residence ?place ;
      pnv:hasName ?nameURI .
      ?uri pnv:hasName ?nameURI .
      ?uri dbo:residence ?place ;
      pnv:hasName ?nameURI .
      optional { ?nameURI pnv:literalName ?name } .
      optional { ?nameURI pnv:literalName ?literalName } .
      optional { ?nameURI pnv:firstName ?firstName } .
      optional { ?nameURI pnv:infix ?infix } .
      optional { ?nameURI pnv:baseSurname ?baseSurname } .
      optional { ?nameURI pnv:surname ?surname } .
      optional { ?nameURI pnv:surnamePrefix ?surnamePrefix } .
      optional { ?nameURI pnv:givenName ?givenName } .
      optional { ?nameURI pnv:patronym ?patronym } .
      optional { ?nameURI pnv:prefix ?prefix } .
      optional { ?nameURI pnv:givenNameSuffix ?givenNameSuffix } .
      optional { ?nameURI pnv:infix ?infix } .
      optional { ?nameURI pnv:suffix ?suffix } .
      optional { ?nameURI pnv:disambiguatingDescription ?disambiguatingDescription } .
      optional { ?nameURI pnv:honorificSuffixwhere ?honorificSuffixwhere }
  }
  `;
  return this.getRDF(query).pipe(
    map(res => {
      // console.log (" people results:" , res);
      return this.parsePersonDetailResults(res);
    }));
  }

  protected parsePersonDetailResults(results: any): PersonData {
    console.log('person results: ', results);
    let resultData: any;
    const tempDict: { [uri: string]: PersonData } = {};
    const itemsDict: { [uri: string]: PersonData } = {};
    let person: PersonData;
    let key: string;
    let label: string;
    let nameURI: string;
    for (let i = 0; i < results['results']['bindings'].length; i++) {
      resultData = results['results']['bindings'][i];
      key = resultData['uri'] ? resultData['uri']['value'] : null;
      label = resultData['label'] ? resultData['label']['value'] : null;
      nameURI = resultData['nameURI'] ? resultData['nameURI']['value'] : null;
      if (null == tempDict[key]) {
        person = new PersonData();
        tempDict[key] = person;
      } else {
        person = tempDict[key];
      }
      if (nameURI !== null) {
        person.hasName[nameURI] = new PersonNameData();
        person.hasName[nameURI].baseSurname = resultData['baseSurname'] ? resultData['baseSurname']['value'] : null;
        person.hasName[nameURI].prefix = resultData['prefix'] ? resultData['prefix']['value'] : null;
        person.hasName[nameURI].literalName = resultData['literalName'] ? resultData['literalName']['value'] : null;
        person.hasName[nameURI].firstName = resultData['firstName'] ? resultData['firstName']['value'] : null;
        person.hasName[nameURI].givenName = resultData['givenName'] ? resultData['givenName']['value'] : null;
        person.hasName[nameURI].surname = resultData['surname'] ? resultData['surname']['value'] : null;
        person.hasName[nameURI].surnamePrefix = resultData['surnamePrefix'] ? resultData['surnamePrefix']['value'] : null;
        person.hasName[nameURI].patronym = resultData['patronym'] ? resultData['patronym']['value'] : null;
        person.hasName[nameURI].trailingPatronym = resultData['trailingPatronym'] ? resultData['trailingPatronym']['value'] : null;
        person.hasName[nameURI].givenNameSuffix = resultData['givenNameSuffix'] ? resultData['givenNameSuffix']['value'] : null;
        person.hasName[nameURI].infix = resultData['infix'] ? resultData['infix']['value'] : null;
        person.hasName[nameURI].infixTitle = resultData['infixTitle'] ? resultData['infixTitle']['value'] : null;
        person.hasName[nameURI].suffix = resultData['suffix'] ? resultData['suffix']['value'] : null;
        person.hasName[nameURI].disambiguatingDescription = resultData['disambiguatingDescription'] ?
          resultData['disambiguatingDescription']['value'] : null;
        person.hasName[nameURI].honorificSuffix = resultData['honorificSuffix'] ? resultData['baseShonorificSuffixurname']['value'] : null;
      }
      person.uri = key;
      person.label = name;
      if (person.label && person.label !== '') {
        if (itemsDict[person.uri] == null) {
          itemsDict[person.uri] = person;
        } else {
          // console.log('Duplicate item found: ', person);
        }
      } else {
        // console.log('Item without a name found: ', person);
      }
    }
    return person;
  }
}


export class RDFData {
  label: string;
  uri: string;
  type: string;
  dctype: string;
  hits?: number;
  selected = false;
}

export class PersonData extends RDFData {
  hasName: { [uri: string]: PersonNameData } = {};

  getName(key?: string): PersonNameData {
    let name = null;
    if (key) {
      if (null !== this.hasName[key]) {
        name = this.hasName[key];
      }
    } else {
      for (const ukey in this.hasName) {
        if (null !== this.hasName[ukey]) {
          return this.hasName[ukey];
        }
      }
    }
    return name;
  }
}

export class PersonNameData {
  prefix: string = null;
  literalName: string = null;
  firstName: string = null;
  givenName: string = null;
  baseSurname: string = null;
  surname: string = null;
  surnamePrefix: string = null;
  patronym: string = null;
  trailingPatronym: string = null;
  givenNameSuffix: string = null;
  infix: string = null;
  infixTitle: string = null;
  suffix: string = null;
  disambiguatingDescription: string = null;
  honorificSuffix: string = null;
}
