import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BACKEND_HOST } from '../main';
import { Feature } from '../types/feature.interface';
import { Project } from '../types/project.interface';
import { errorHandler } from '../utils/error.utils';

@Injectable()
export class FeatureService {
  constructor(private http: Http) {}

  public createFeature(project: Project, feature: Feature): Observable<Feature> {
    return this.http.post(BACKEND_HOST + '/projects/' + project.name + '/features', feature, {
      withCredentials: true
    })
      .map(res => res.json())
      .catch(errorHandler);
  }

  public deleteFeature(project: Project, feature: Feature): Observable<Feature> {
    return this.http.delete(BACKEND_HOST + '/projects/' + project.name + '/features/' + feature.name, {
      withCredentials: true
    })
      .map(res => res.json())
      .catch(errorHandler);
  }

  public updateFeature(project: Project, feature: Feature, featureName?: string): Observable<void> {
    featureName = featureName || feature.name;

    return this.http.put(BACKEND_HOST + '/projects/' + project.name + '/features/' + featureName, feature, {
      withCredentials: true
    })
      .map(res => res.json())
      .catch(errorHandler);
  }
}
