import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//enable Sentry
import * as Sentry from "@sentry/angular-ivy";
import { BrowserTracing } from "@sentry/tracing";

import { environment } from './environments/environment.prod';
import { AppModule } from '@app/app.module';

Sentry.init({
  dsn: "https://090e2a8b5ec24424a648996e143cfaa8@o4504073869459456.ingest.sentry.io/4504073873588224",
  integrations: [
    new BrowserTracing({
      tracingOrigins: ["localhost", "https://yourserver.io/api"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(success => console.log(`Bootstrap success`))
  .catch(err => console.error(err));
//end enable Sentry

Date.prototype.toString = function () {
  return `${this.getDate()}.${this.getMonth() + 1}.${this.getFullYear()}`;
};

if (environment.production) {
  enableProdMode();
}
