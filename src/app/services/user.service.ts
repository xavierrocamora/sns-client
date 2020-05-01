import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs/Observable';
import { GLOBAL } from './global';
import { User } from '../models/user';


@Injectable()
export class UserService{
    public url: string;
    public identity;
    public token;
    public statCounters;


    constructor(public _http: HttpClient){
        this.url = GLOBAL.url;
    }

    // Method used to register a new user
    register(user: User): Observable<any>{
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

    // get the data, for the authenticated User, from the store
    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('userProfile'));

        if (identity != undefined){
            this.identity = identity;
        }else{
            this.identity = null;
        }
        return this.identity;
    }

    // get the stored authentication token 
    getToken(){
        let token = JSON.parse(localStorage.getItem('token'));

        if (token != undefined){
            this.token = token;
        }else{
            this.token = null;
        }
        return this.token;
    }

    // get the statistic counters for a given user
    // if not id is provided get currently authenticated user's counters instead  
    getCounters(userId = null): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + this.getToken());

        if (userId != null){
            return this._http.get(this.url + 'users/counters/' + userId, {headers: headers});
        }else{
            return this._http.get(this.url + 'users/counters/', {headers: headers});
        }
    }

    // get counters from localStorage instead of sending a petition again
    getStoredCounters(){
        let storedCounters = JSON.parse(localStorage.getItem('counters'));

        if(storedCounters !="undefined"){
            this.statCounters = storedCounters;
        }else{
            this.statCounters = null;
        }
        return this.statCounters;
    }

    // Method for updating changes on the user's profile
    updateUser(user: User): Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + this.getToken());
        
        return this._http.put(this.url + 'users/' + user._id, params, {headers: headers});
    }

     // Method for getting a paginated list of all users
     getUsers(page = null): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + this.getToken());
        
        return this._http.get(this.url + 'users/page/' + page, {headers: headers});
    }

      // Method for getting a specified user profile
      getUser(id): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + this.getToken());
        
        return this._http.get(this.url + 'users/' + id, {headers: headers});
    }

}