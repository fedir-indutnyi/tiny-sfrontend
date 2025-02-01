
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class WeatherService {
    static times = 0;
    private baseUrl: string = 'https://www.sojson.com/open/api/weather/json.shtml?city=深圳';

    constructor(private http: HttpClient) { }

    getJSON() {
        let callback = "&callback=" + "__ng_jsonp__.__req" + WeatherService.times + ".finished";
        WeatherService.times++;
        let url = this.baseUrl + callback;
        return this.http.jsonp(url, 'callback').pipe(map(res => (res as any).json()));
    }


    DATA = [
        {
            "date": "03-04",
            "high": "29.0℃",
            "low": "22.0℃",
            "fl": "<3级",
            "type": "dayu",
        }, {
            "date": "03-05",
            "high": "32.0℃",
            "low": "28.0℃",
            "fl": "<2级",
            "type": "duoyun",
        }, {
            "date": "03-06",
            "high": "19.0℃",
            "low": "17.0℃",
            "fl": "<3级",
            "type": "leidian",
        }, {
            "date": "03-07",
            "high": "32.0℃",
            "low": "25.0℃",
            "fl": "<2级",
            "type": "qing",
        }, {
            "date": "03-08",
            "high": "27.0℃",
            "low": "22.0℃",
            "fl": "<4级",
            "type": "yintian",
        }]
}
