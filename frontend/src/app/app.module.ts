// Senty

import { APP_INITIALIZER, ErrorHandler, inject } from "@angular/core";
import { Router } from "@angular/router";
import * as Sentry from "@sentry/angular-ivy";

// end senty
import { NgxMatNativeDateModule } from "@angular-material-components/datetime-picker";
import { registerLocaleData } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import en from "@angular/common/locales/en";
import { NgModule, isDevMode } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// TODO: Check if MatMomentDateModule is really needed
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
/** config ng-zorro-antd i18n **/
import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { en_US, NZ_I18N } from "ng-zorro-antd/i18n";
// TODO: There are two editors whithtin the project: pell and ngx-quill. Verify whether two of them are needed to be in use
import { QuillModule } from "ngx-quill";
import { environment } from "./../environments/environment";
import { AppComponent } from "./app.component";
import { routing } from "./app.routing";
import { PagesModule } from "./pages/pages.module";
import { AccountService } from "./shared/account/account.service";
import { AuthGuard } from "./shared/auth-guard/auth-guard";
import { LoaderComponent } from "./shared/loader/loader.component";
import { LoaderInterceptor } from "./shared/loader/loader.interceptor";
import { LoaderService } from "./shared/loader/loader.service";
import { ApiModule, Configuration } from "./shared/sdk";
import { PivotService } from "./shared/services/pivot.service";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { MatIconModule } from "@angular/material/icon";
import { SharedModule } from "@shared/shared.module";
import { EnvService } from "./shared/services/env.service";
import { lastValueFrom, shareReplay } from "rxjs";

export function HttpLoaderFactory(http: HttpClient):TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

registerLocaleData(en);

@NgModule({ declarations: [AppComponent, LoaderComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        NzSpaceModule,
        NzCardModule,
        MatIconModule,
        PagesModule,
        routing,
        NzLayoutModule,
        SharedModule,
        ApiModule.forRoot(() => {
            return new Configuration({
                basePath: inject(EnvService).configuration?.baseUrl ?? environment.baseUrl
            });
        }),
        QuillModule.forRoot(),
        MatMomentDateModule,
        NgxMatNativeDateModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            defaultLanguage: 'en',
        }),
        StoreModule.forRoot({}, { runtimeChecks: {
                strictStateImmutability: true,
                strictActionImmutability: true,
                strictActionSerializability: true,
                strictStateSerializability: true,
                strictActionTypeUniqueness: true,
                strictActionWithinNgZone: true,
            } }),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
        EffectsModule.forRoot()], providers: [
        PivotService,
        AuthGuard,
        AccountService,
        LoaderService,
        { provide: NZ_I18N, useValue: en_US },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true,
        },
        // below providers only for Senty
        {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler({
                showDialog: false,
            }),
        },
        {
            provide: Sentry.TraceService,
            deps: [Router],
        },
        {
            provide: APP_INITIALIZER,
            useFactory: () => () => { },
            deps: [Sentry.TraceService],
            multi: true,
        },
        // End of providers only for Senty
        {
            provide: APP_INITIALIZER,
            useFactory: (envConfigService: EnvService) => () => envConfigService.load(),
            deps: [EnvService],
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {
}
