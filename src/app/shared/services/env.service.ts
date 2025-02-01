import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { firstValueFrom } from "rxjs"

export interface EnvConfiguration{
  envname: string,
  production: boolean,
  baseUrl: string,
  fileDynamicPlaceholder: string,
  fileDynamicPlaceholderUrl: string,
  autologinTestUser: boolean,
  ImportantNoticeEnabled: boolean,
  autologinTestUserCredentials: {username?: string, password?: string},
  environmentBadgeLabel: string,
  environmentBadgeDisplay: boolean;
}

@Injectable({ providedIn: 'root' })
export class EnvService {
  private readonly apiUrl = '../../../assets/config/envConfig/envConfig.json';
  public configurationPromise: Promise<void | EnvConfiguration>; 
  public configuration: EnvConfiguration;
  static instance: EnvService;

  constructor(private http: HttpClient) {
    EnvService.instance = this;
  }

  public load() {
    if (!this.configurationPromise) {
      console.log('Absolute Path of Config:', this.getAbsoluteConfigUrl());
      this.configurationPromise = firstValueFrom(this.http.get<EnvConfiguration>(this.apiUrl)).then(
        config => {this.configuration = config; return config},
        error => console.log("No config found in assets foler. Now using data from env variables")
      )
    }
  }

  private getAbsoluteConfigUrl(): string {
    const anchor = document.createElement('a');
    anchor.href = this.apiUrl;
    return anchor.href;
  }
}