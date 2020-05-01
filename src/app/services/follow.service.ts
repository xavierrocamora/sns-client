import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Follow } from '../models/follow';

@Injectable()
export class FollowService{
    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    // method to start following an user
    addFollow(token, follow): Observable<any>{
        let params = JSON.stringify(follow);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + token);

        return this._http.post(this.url + 'follows', params, {headers: headers});
    }

    // method for stop following an user
    deleteFollow(token, id): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + token);

        return this._http.delete(this.url + 'follows/' + id, {headers: headers});
    }

}