import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { User } from '../types/user.interface';
import { Error } from '../types/error.interface';
import { BACKEND_HOST } from '../main';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class UserService {
  public user: ReplaySubject<User> = new ReplaySubject<User>();

  constructor(private http: Http) {}

  public fetchUserInfo(): Observable<User> {
    let obs: Observable<User> = this.http.get(BACKEND_HOST + '/auth', { withCredentials: true })
      .map(res => res.json())
      .catch(e => {
        let err: Error = e.json().error;

        this.user.error(err);

        return Observable.throw(err);
      });

    obs.subscribe(user => {
      this.user.next(user);
    });

    return obs;
  }

  public logout(): Observable<User> {
    let obs: Observable<User> = this.http.get(BACKEND_HOST + '/auth/logout', { withCredentials: true }).catch(e => {
      let err: Error = e.json().error;

      this.user.error(err);

      return Observable.throw(err);
    });

    obs.subscribe(() => {
      this.user.next(null);
    });

    return obs;
  }
}
