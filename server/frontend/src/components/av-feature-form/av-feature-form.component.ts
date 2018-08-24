import { Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { Feature } from '../../types/feature.interface';
import { Project } from '../../types/project.interface';
import { FeatureService } from '../../services/feature.service';
import { AceEditorComponent } from 'ng2-ace-editor';
import { NotificationsService } from 'angular2-notifications';
import { SliderService } from '../../services/slider.service';
import { ExampleUrl } from '../../types/example-url.interface';

@Component({
  selector: 'av-feature-form',
  templateUrl: './av-feature-form.component.html'
})
export class AVFeatureFormComponent implements OnInit {
  @HostBinding('style.display') private displayStyle = 'block';

  @ViewChild('scriptEditor') public scriptEditor: AceEditorComponent;

  @Input() public project: Project;

  private featureCopy: Feature;
  private _feature: Feature;

  public busy = false;
  public newExampleUrl: string;

  constructor(
    private featureService: FeatureService,
    private notificationsService: NotificationsService,
    private sliderService: SliderService
  ) {}

  public ngOnInit(): void {
    this.scriptEditor.setMode('javascript');
    this.scriptEditor.setTheme('solarized_dark');

    this.scriptEditor.getEditor().container.style.lineHeight = 1.5;
    this.scriptEditor.getEditor().renderer.setScrollMargin(10, 10);

    this.scriptEditor.getEditor().setOptions({
      useSoftTabs: true,
      tabSize: 2,
      showPrintMargin: false,
      highlightActiveLine: false
    });
  }

  public updateFeature() {
    this.busy = true;

    this.featureService.updateFeature(this.project, this.featureCopy, this.feature.name).subscribe(() => {
      this.busy = false;

      let featureIndex = this.project.features.findIndex(f => f.name === this.feature.name);

      if (featureIndex > -1) {
        this.project.features[featureIndex] = JSON.parse(JSON.stringify(this.featureCopy));
      }

      this.feature = this.featureCopy;

      this.notificationsService.success('Changes stored.');
    });
  }

  public deleteFeature() {
    this.busy = true;

    this.featureService.deleteFeature(this.project, this.feature).subscribe(() => {
      this.busy = false;

      this.project.features = this.project.features.filter(f => f.name !== this.feature.name);
      this.sliderService.slider.toggle();
      this.notificationsService.success('Changes stored.');
    });
  }

  public createExampleUrl(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      if (this.newExampleUrl && this.newExampleUrl !== '') {
        this.featureCopy.exampleUrls.push({ url: this.newExampleUrl });
        this.newExampleUrl = '';

        this.updateFeature();
      }
    }
  }

  public deleteExampleUrl(exampleUrl: ExampleUrl) {
    this.featureCopy.exampleUrls = this.featureCopy.exampleUrls.filter(e => e.url !== exampleUrl.url);
    this.updateFeature();
  }

  @Input()
  set feature(value: Feature) {
    this.featureCopy = JSON.parse(JSON.stringify(value));
    this._feature = value;
  }

  get feature(): Feature {
    return this._feature;
  }
}
