import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams, HttpResponse } from '@angular/common/http';
// import { BaseLoopBackApi } from '../sdk_/services/core/base.service';
// import { SDKModels } from '../sdk_/services/custom/SDKModels';
// import { LoopBackConfig as cfg } from '../sdk_/lb.config';
// import { LoopBackAuth } from '../sdk_/services/core/auth.service';
// import { ErrorHandler } from '../sdk_/services/core/error.service';
import { Observable } from 'rxjs';
// import { SocketConnection } from '../sdk_/sockets/socket.connections';
import { catchError, map, filter } from 'rxjs/operators';

@Injectable()
export class FileUploadService /* extends BaseLoopBackApi */ {

  private apiURL = ''/* cfg.getPath() + '/' + cfg.getApiVersion() */;
  private uploadURL = this.apiURL + '/FileUploads/upload';

  constructor(
    @Inject(HttpClient) protected http: HttpClient,
    // @Inject(SocketConnection) protected connection: SocketConnection,
    // @Inject(SDKModels) protected models: SDKModels,
    // @Inject(LoopBackAuth) protected auth: LoopBackAuth,
    // @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    // super(http,  connection,  models, auth, errorHandler);
  }

  public upload(file: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);

    let params = new HttpParams();
    let headers = new HttpHeaders();

    // headers = this.authenticate(this.uploadURL, headers);

    const options = {
      headers: headers,
      params: params,
      // withCredentials: cfg.getRequestOptionsCredentials()
    };

    const request = new HttpRequest('POST', this.uploadURL, fd, options);

    return this.http.request(request).pipe(
      filter(event => event instanceof HttpResponse),
      map((res: HttpResponse<any>) => res.body),
      // catchError((e) => this.errorHandler.handleError(e))
    );
  }

  public getModelName() {
    return 'FileUpload';
  }

}
