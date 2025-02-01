import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";
import {MatChipsModule} from "@angular/material/chips";

import {EditCreateTeamComponent} from './edit-create-team.component';
import {SharedModule} from '@shared/shared.module';
import {routing} from './edit-create-team.routing';


@NgModule({
    imports: [CommonModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatIconModule,
        SharedModule,
        routing,
        ReactiveFormsModule,
        FormsModule,
        MatChipsModule,
        CdkVirtualScrollViewport,
        NzSkeletonModule,
        ScrollingModule,
    ],
    declarations: [EditCreateTeamComponent]
})
export class EditCreateTeamModule {
}
