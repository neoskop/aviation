import {
  Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
import { Project } from '../../types/project.interface';
import { Feature } from '../../types/feature.interface';
import { FeatureService } from '../../services/feature.service';
import { ProjectService } from '../../services/project.service';
import { NotificationsService } from 'angular2-notifications/dist';
import { anime } from '../../vendor';
import { AVDeleteButtonComponent } from '../av-delete-button/av-delete-button.component';
import { titleToName } from '../../utils/name.utils';

@Component({
  selector: 'av-project-card',
  templateUrl: './av-project-card.component.html'
})
export class AVProjectCardComponent implements OnInit {
  @HostBinding('style.display') private displayStyle = 'block';
  @HostBinding('style.transition') private transitionStyle = 'top 0.3s, left 0.3s';

  @ViewChild('card') private cardElementRef: ElementRef;
  @ViewChild('deleteButton') private deleteButton: AVDeleteButtonComponent;
  @ViewChild('settingsButton') private settingsButtonElementRef: ElementRef;
  @ViewChild('saveButton') private saveButtonElementRef: ElementRef;
  @ViewChildren('frontSection') private frontSectionElementRefs: QueryList<ElementRef>;
  @ViewChildren('backSection') private backSectionElementRefs: QueryList<ElementRef>;

  @Input() public project: Project;
  @Output() public featureSelected: EventEmitter<Feature> = new EventEmitter<Feature>();

  public activeLayer = 'front';
  public newFeatureTitle: string;
  public flipTransitioning = false;
  public projectName: string;

  constructor(
    private featureService: FeatureService,
    private projectService: ProjectService,
    private notificationsService: NotificationsService
  ) {}

  public ngOnInit() {
    this.projectName = this.project.name;

    setTimeout(() => {
      let cardTop = this.card.getBoundingClientRect().top;

      this.saveButtonElementRef.nativeElement.style.transform = 'translateY(30px)';
      this.deleteButton.element.style.transform = 'translateY(30px)';

      this.backSectionElementRefs.forEach(f => {
        let offset = f.nativeElement.getBoundingClientRect().top
          - cardTop
          + f.nativeElement.getBoundingClientRect().height;

        f.nativeElement.style.transform = 'translateY(' + (-offset) + 'px)';
      });
    });
  }

  public flip() {
    if (!this.flipTransitioning) {
      this.flipTransitioning = true;
      let fromLayer = (this.activeLayer === 'front') ? this.frontSectionElementRefs : this.backSectionElementRefs;
      let toLayer = (this.activeLayer === 'front') ? this.backSectionElementRefs : this.frontSectionElementRefs;

      this.switchToolButtons();

      this.slideOutLayer(fromLayer).then(() => {
        setTimeout(() => {
          this.slideInLayer(toLayer).then(() => {
            this.activeLayer = (this.activeLayer === 'front') ? 'back' : 'front';
            this.flipTransitioning = false;
          });
        }, 250);
      });
    }
  }

  public updateProject() {
    this.projectService.updateProject(this.projectName, this.project).first().subscribe(() => {
      this.notificationsService.success('Changes stored.');
    }, e => {
      this.notificationsService.error(e.userMessage);
    });
  }

  public deleteProject() {
    this.projectService.deleteProject(this.project).first().subscribe(() => {
      this.projectService.fetchProjects();
    }, e => {
      this.notificationsService.error(e.userMessage);
    });
  }

  public selectFeature(feature: Feature) {
    this.featureSelected.emit(feature);
  }

  public toggleFeature(feature: Feature, enabled: boolean) {
    feature.enabled = enabled;
    this.featureService.updateFeature(this.project, feature).first().subscribe();
  }

  public toggleFeatureFunction(feature: Feature) {
    feature.functionEnabled = !feature.functionEnabled;
    this.featureService.updateFeature(this.project, feature).first().subscribe();
  }

  public createFeature(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      if (this.newFeatureTitle && this.newFeatureTitle !== '') {
        let feature: Feature = {
          name: titleToName(this.newFeatureTitle),
          title: this.newFeatureTitle,
          enabled: false
        };

        this.featureService.createFeature(this.project, feature).first().subscribe(() => {
          this.projectService.fetchProjects();
        }, e => {
          this.notificationsService.error(e.userMessage);
        });
      }
    }
  }

  private slideOutLayer(layer: QueryList<ElementRef>): Promise<void> {
    return new Promise<void>((resolve) => {
      let cardTop = this.card.getBoundingClientRect().top;

      layer.forEach((f, i) => {
        setTimeout(() => {
          let offset = f.nativeElement.getBoundingClientRect().top
            - cardTop
            + f.nativeElement.getBoundingClientRect().height;

          anime({
            targets: f.nativeElement,
            translateY: -offset + 'px',
            elasticity: 300,
            duration: 750,
            easing: 'easeInElastic'
          }).finished.then(() => {
            if (i === layer.length - 1) {
              resolve();
            }
          });
        }, i * 100);
      });
    });
  }

  private slideInLayer(layer: QueryList<ElementRef>): Promise<void> {
    return new Promise<void>((resolve) => {
      layer.toArray().reverse().forEach((f, i) => {
        setTimeout(() => {
          anime({
            targets: f.nativeElement,
            translateY: '0',
            elasticity: 300,
            duration: 750,
            easing: 'easeOutElastic'
          }).finished.then(() => {
            if (i === layer.length - 1) {
              resolve();
            }
          });
        }, i * 100);
      });
    });
  }

  private switchToolButtons() {
    if (this.activeLayer === 'front') {
      anime({
        targets: this.settingsButtonElementRef.nativeElement,
        translateY: '30px',
        duration: 500
      }).finished.then(() => {
        setTimeout(() => {
          anime({
            targets: this.saveButtonElementRef.nativeElement,
            translateY: '0',
            duration: 500,
            elasticity: 500,
            easing: 'easeOutElastic'
          });

          anime({
            targets: this.deleteButton.element,
            translateY: '0',
            duration: 500,
            elasticity: 500,
            easing: 'easeOutElastic'
          });
        }, 1000);
      });
    } else {
      anime({
        targets: this.deleteButton.element,
        translateY: '30px',
        duration: 500
      });

      anime({
        targets: this.saveButtonElementRef.nativeElement,
        translateY: '30px',
        duration: 500
      }).finished.then(() => {
        setTimeout(() => {
          anime({
            targets: this.settingsButtonElementRef.nativeElement,
            translateY: '0',
            duration: 500,
            elasticity: 500,
            easing: 'easeOutElastic'
          });
        }, 1000);
      });
    }
  }

  get card(): HTMLElement {
    return <HTMLElement>this.cardElementRef.nativeElement;
  }
}
