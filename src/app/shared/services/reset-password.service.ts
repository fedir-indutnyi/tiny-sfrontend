import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
// import { LoopBackConfig as cfg } from '../sdk_/lb.config';
import { Observable } from 'rxjs';

@Injectable()
export class ResetPasswordService {

  private apiURL = ''/* cfg.getPath() + '/' + cfg.getApiVersion() */;
  private resetURL = this.apiURL + '/userprofiles/reset-password';

  constructor(@Inject(HttpClient) protected http: HttpClient) {}

  public setNewPassword(accessToken: string, password: string): Observable<any> {

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: new HttpParams().append('access_token', accessToken)
    };

    const data = JSON.stringify({ newPassword: password });

    const request = new HttpRequest('POST', this.resetURL, data, options);
    return this.http.request(request);
  }


}
