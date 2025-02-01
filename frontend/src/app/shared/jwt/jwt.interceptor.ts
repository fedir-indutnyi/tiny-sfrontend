import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { AccountService } from '../account/account.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.accountService.currentUserValue;
        if (currentUser && currentUser.accessTokens) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.accessTokens}`
                }
            });
        }

        return next.handle(request);
    }
}
