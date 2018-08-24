import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

export function errorHandler(e: any) {
  let err: Error = e.json().error;
  return Observable.throw(err);
}
