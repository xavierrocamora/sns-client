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

    // method for getting a paginated list of all users followed by a specified user
    // if no id then user is the authenticated one
    getFollowedUsers(token, id = null, page=1): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + token);
        
        let url = this.url + 'followedUsers/';
        if(id != null){
            url = this.url + 'followedUsers/' + id + '/' + page;
        }
        return this._http.get(url, {headers: headers});   
    }

    // method for getting a paginated list of all users following specified user
    // if no id then user is the authenticated one
    getFollowers(token, id = null, page=1): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + token);
        
        let url = this.url + 'followers/';
        if(id != null){
            url = this.url + 'followers/' + id + '/' + page;
        }
        return this._http.get(url, {headers: headers});   
    }

    // method for getting a list of followers for the auth user
    // mainly used in the messagery module 
    getMyFollows(token): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + token);
        
        return this._http.get(this.url + 'follows/true', {headers: headers});
    }


}