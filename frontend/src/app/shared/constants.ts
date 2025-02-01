import { Component, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { EnvService } from './services/env.service';


const SERVER_BASE_HREF =  inject(EnvService).configuration?.baseUrl ?? environment.baseUrl;
const API_BASE_HREF =  inject(EnvService).configuration?.baseUrl ?? (environment.baseUrl && "/api");


export {
  SERVER_BASE_HREF,
  API_BASE_HREF
};

