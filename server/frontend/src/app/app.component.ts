import { Component } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Project } from '../types/project.interface';
import { User } from '../types/user.interface';
import { UserService } from '../services/user.service';
import { Feature } from '../types/feature.interface';
import { SliderService } from '../services/slider.service';

@Component({
  selector: 'aviation-app',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public projects: Project[] = [];
  public user: User;
  public currentProject: Project;
  public currentFeature: Feature;
  public notificationConfig: any;

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private sliderService: SliderService
  ) {
    this.projectService.projects.subscribe(projects => {
      this.projects = projects.reverse();
    });

    this.userService.user.subscribe(user => {
      this.user = user;
      this.projectService.fetchProjects();
    }, () => {
      this.user = null;
    });

    this.userService.fetchUserInfo();

    this.notificationConfig = {
      maxStack: 1,
      theClass: 'm-notification',
      timeOut: 3000,
      showProgressBar: false
    };

    console.info(`%cAviation`, 'font-family: sans-serif; color: #0073c4; font-size: 22px;');
    console.info(`%c5 cl gin
1.5 cl lemon juice
1 cl maraschino liqueur
0.7 cl crème de violette
    `, 'font-family: sans-serif; font-size: 16px; line-height: 1.4;');
  }

  public logout() {
    this.userService.logout();
  }

  public featureEditView(project: Project, feature: Feature) {
    this.currentProject = project;
    this.currentFeature = feature;
    this.sliderService.slider.toggle();
  }

  get loggedIn(): boolean {
    return !!this.user;
  }

  get loggedOut(): boolean {
    return this.user === null;
  }
}
