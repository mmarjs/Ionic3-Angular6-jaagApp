/**
 * Created by DRAGAN on 3/22/2017.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../services/app-settings';

@Injectable()
export class HttpService {

  constructor(private http: HttpClient) {}

  sendData(email:string) {
    return this.http.get("http://facebook.us14.list-manage.com/subscribe/post-json?u=2c0f7baa8dc004a62ff3922e3&id=456928d791&EMAIL="+encodeURI(email)+"&b_2c0f7baa8dc004a62ff3922e3_456928d791");
  }

  getJaag(url_loc: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': AppSettings.JAAG.srctkn
      })
    };
    return this.http.get(AppSettings.JAAG.srcurl+encodeURI(url_loc), httpOptions);
  }
}