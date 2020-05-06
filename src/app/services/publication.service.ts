import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Publication } from '../models/publication';

@Injectable()
export class PublicationService{
    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url; 
    }

    addPublication(token, publication): Observable<any>{
        publication._id = undefined;
        let params = JSON.stringify(publication);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + token);

        return this._http.post(this.url + 'publications', params, {headers: headers});
    }

    // Get all publications done by the users followed by user
    getPublications(token, page = 1): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + token);

        return this._http.get(this.url + 'publications/page/'+ page, {headers: headers});
    }

    deletePublication(token, id): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + token);

        return this._http.delete(this.url + 'publications/' + id, {headers: headers});
    }


}