import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { provideHttpClient, withInterceptorsFromDi, withJsonpSupport } from '@angular/common/http';

/* components */
import { CardComponent } from './components/card/card.component';
import { TodolistComponent } from './components/todolist/todolist.component';
import { TabsetComponent } from './components/tabset/tabset.component';
import { TabContentComponent } from './components/tabset/tab-content/tab-content.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { FileTreeComponent } from './components/file-tree/file-tree.component';
import { SwitchComponent } from './components/switch/switch.component';
// TODO: There are two editors whithtin the project: pell and ngx-quill. Verify whether two of them are needed to be in use
import { PellEditorComponent } from './components/pell-editor/pell-editor.component';
import { AlertComponent } from './components/alert/alert.component';
import { WeatherComponent } from './components/weather/weather.component';
import { UploadProfilePhotoComponent } from './components/upload-profile-photo/upload-profile-photo.component';
import { ContactsModalComponent } from './components/contacts-modal/contacts-modal.component';
import { InfiniteScrollDirective } from './infinite-scroll/infinite-scroll.directive';
import { AccelerationFormComponent } from './components/acceleration-form/acceleration-form.component';
import { NgZorroModule } from './ng-zorro/ng-zorro.module';
// Material Components. TODO: Create separate module for material's components. Analoge to NgZorroModule
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DonationMessageComponent } from './donation-message/donation-message.component';

@NgModule({ declarations: [
        CardComponent,
        FileTreeComponent,
        TodolistComponent,
        TabsetComponent,
        TabContentComponent,
        ProgressBarComponent,
        SwitchComponent,
        PellEditorComponent,
        AlertComponent,
        WeatherComponent,
        UploadProfilePhotoComponent,
        InfiniteScrollDirective,
        AccelerationFormComponent,
        ContactsModalComponent,
        DonationMessageComponent
    ],
    exports: [
        CardComponent,
        FileTreeComponent,
        TodolistComponent,
        TabsetComponent,
        TabContentComponent,
        ProgressBarComponent,
        SwitchComponent,
        PellEditorComponent,
        DonationMessageComponent,
        AlertComponent,
        WeatherComponent,
        UploadProfilePhotoComponent,
        InfiniteScrollDirective,
        AccelerationFormComponent,
        MatMenuModule,
        MatIconModule,
        NgZorroModule,
        ContactsModalComponent
    ], imports: [CommonModule,
        NgxPaginationModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        NgZorroModule,
        NgOptimizedImage], providers: [provideHttpClient(withInterceptorsFromDi(), withJsonpSupport())] })
export class SharedModule { }
