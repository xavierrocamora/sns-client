import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Message } from '../models/message';

@Injectable()
export class MessageService{
    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    addMessage(token, message): Observable<any>{
        message._id = undefined;
        let params = JSON.stringify(message);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + token);

        return this._http.post(this.url + 'messages', params, {headers: headers});
    }

    getMessages(token, page = 1): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + token);

        return this._http.get(this.url + 'messages/mailbox/'+ page, {headers: headers});
    }

    getSentMessages(token, page = 1): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + token);

        return this._http.get(this.url + 'messages/sent/'+ page, {headers: headers});
    }

    // Get the number of messages marked as non read
    getNonReadCounter(token): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('authorization', 'Token ' + token);

        return this._http.get(this.url + 'messages/mailbox/notRead', {headers: headers});
    }
}