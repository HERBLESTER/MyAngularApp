import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MetaDataService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.fetchMetadata();
  }
  public metaData: MetaData;

  fetchMetadata() {
      this.http.get<MetaData>(this.baseUrl + 'api/metadata/getmetadata').subscribe(result => {
        this.metaData = result;
      }, error => console.error(error));
    }
  }

interface City {
  id: number;
  name: string;
}

interface Operation {
  id: number;
  name: string;
}

interface Customer {
  id: number;
  name: string;
}

interface MetaData {
  cities: City[],
  operations: Operation[],
  customers: Customer[]
}
