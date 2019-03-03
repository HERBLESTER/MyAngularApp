import { MetaData } from '../app/domain/domain';
import { Observable } from 'rxjs/Observable';

export class MetaDataServiceStub {
  public metaData: Observable<MetaData>;

  constructor(metaData?: Observable<MetaData>) {
    this.metaData = metaData;
  }
}
