import { Component, EventEmitter, HostBinding, Output } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../types/project.interface';
import { titleToName } from '../../utils/name.utils';
import { NotificationsService } from 'angular2-notifications/dist';

@Component({
  selector: 'av-project-creation-form',
  templateUrl: './av-project-creation-form.component.html'
})
export class AVProjectCreationFormComponent {
  @HostBinding('style.display') private displayStyle = 'block';

  @Output('submit') private onSubmit: EventEmitter<void> = new EventEmitter<void>();

  public projectTitle = '';
  public projectToken = '';

  constructor(private projectService: ProjectService, private notificationsService: NotificationsService) {}

  public createProject() {
    this.projectService.createProject(<Project>{
      name: titleToName(this.projectTitle),
      title: this.projectTitle,
      token: this.projectToken,
      color: '#643c78'
    }).subscribe(project => {
      this.projectTitle = '';
      this.projectToken = '';

      let projects: Project[] = this.projectService.projects.getValue();
      projects.push(project);

      this.projectService.projects.next(projects);

      this.onSubmit.emit();
    }, e => {
      this.notificationsService.error(e.userMessage);
    });
  }
}
