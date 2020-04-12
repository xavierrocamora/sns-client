import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs/Observable';
import { GLOBAL } from './global';
import { User } from '../models/user';
import jwtDecode from 'jwt-decode';

@Injectable()
export class UserService{
    public url: string;
    public identity;
    public token;


    constructor(public _http: HttpClient){
        this.url = GLOBAL.url;
    }

    // Method used to register a new user
    register(user: User): Observable<any>{
        console.log(user);
        console.log(this.url);
        user._id = undefined;
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url+'register', params, {headers: headers});
    }

    // Method for signing up an user
    login(user: User): Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url+'login', params, {headers: headers});
       
    }

    // get the data, from the authenticatedUser, attached to the payload of the token
    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('authenticatedUser'));

        if (identity != undefined){
            // we previously checked there was a token attached to the authenticatedUser
            // before storing it, therefore there must be a token
            let decoded = jwtDecode(identity.token);
            console.log(decoded);
            this.identity = decoded;
        }else{
            this.identity = null;
        }
        return this.identity;
    }

    getToken(){
        let identity = JSON.parse(localStorage.getItem('authenticatedUSer'));

        if (identity != undefined){
            this.token = identity.token;
        }else{
            this.token = null;
        }
        return this.token;
    }

}