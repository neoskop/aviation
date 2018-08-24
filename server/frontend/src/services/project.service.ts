import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BACKEND_HOST } from '../main';
import { Project } from '../types/project.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { errorHandler } from '../utils/error.utils';

@Injectable()
export class ProjectService {
  public projects: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);

  constructor(private http: Http) {}

  public fetchProjects(): Observable<Project[]> {
    let obs = this.http.get(BACKEND_HOST + '/projects', { withCredentials: true })
      .map(res => res.json())
      .map(res => res.sort((a: Project, b: Project) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))
      .catch(errorHandler);

    obs.subscribe(projects => {
      this.projects.next(projects);
    });

    return obs;
  }

  public createProject(project: Project): Observable<Project> {
    return this.http.post(BACKEND_HOST + '/projects', project, { withCredentials: true })
      .map(res => res.json())
      .catch(errorHandler);
  }

  public updateProject(projectName: string, project: Project): Observable<void> {
    return this.http.put(BACKEND_HOST + '/projects/' + projectName, project, {
      withCredentials: true
    })
      .map(res => res.json())
      .catch(errorHandler);
  }

  public deleteProject(project: Project): Observable<void> {
    return this.http.delete(BACKEND_HOST + '/projects/' + project.name, {
      withCredentials: true
    })
      .map(res => res.json())
      .catch(errorHandler);
  }
}
