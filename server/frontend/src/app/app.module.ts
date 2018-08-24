import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AVMasonryDirective } from '../components/av-masonry/av-masonry.component';
import { AVProjectCardComponent } from '../components/av-project-card/av-project-card.component';
import { ProjectService } from '../services/project.service';
import { UiSwitchModule } from 'angular2-ui-switch';
import { FormsModule } from '@angular/forms';
import { FeatureService } from '../services/feature.service';
import { UserService } from '../services/user.service';
import { AVExpandingButtonComponent } from '../components/av-expanding-button/av-expanding-button.component';
import { AVTippyDirective } from '../components/av-tippy/av-tippy.component';
import { AVSliderComponent } from '../components/av-slider/av-slider.component';
import { SliderService } from '../services/slider.service';
import { AceEditorModule } from 'ng2-ace-editor';
import { AVClipboardDirective } from '../components/av-clipboard/av-clipboard.component';
import { AVFeatureFormComponent } from '../components/av-feature-form/av-feature-form.component';
import { SimpleNotificationsModule } from 'angular2-notifications/dist';
import { AVDeleteButtonComponent } from '../components/av-delete-button/av-delete-button.component';
import { AVDialogButtonComponent } from '../components/av-project-add-button/av-dialog-button.component';
import { AVProjectCreationFormComponent } from '../components/av-project-creation-form/av-project-creation-form.component';

@NgModule({
  imports: [
    AceEditorModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    SimpleNotificationsModule.forRoot(),
    UiSwitchModule
  ],
  declarations: [
    AppComponent,
    AVClipboardDirective,
    AVDeleteButtonComponent,
    AVDialogButtonComponent,
    AVExpandingButtonComponent,
    AVFeatureFormComponent,
    AVMasonryDirective,
    AVProjectCardComponent,
    AVProjectCreationFormComponent,
    AVSliderComponent,
    AVTippyDirective
  ],
  exports: [
    AppComponent,
    AVClipboardDirective,
    AVDeleteButtonComponent,
    AVDialogButtonComponent,
    AVExpandingButtonComponent,
    AVFeatureFormComponent,
    AVMasonryDirective,
    AVProjectCardComponent,
    AVProjectCreationFormComponent,
    AVSliderComponent,
    AVTippyDirective
  ],
  providers: [
    FeatureService,
    ProjectService,
    SliderService,
    UserService,

    { provide: LOCALE_ID, useValue: 'en-US' }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
