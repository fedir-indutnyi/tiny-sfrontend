import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class PnlDataService {

    constructor(@Inject(HttpClient) protected http: HttpClient) {
    }


}
