import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

// this service is meant to be instanced as a singleton
// and be consumed by the different child in a parent view
// so that a child can comunicate the sidebar child that it needs to update
// this service MUST BE DECLARED ON APP.MODULE provider (root) 
// so that it works as a singleton
@Injectable()
export class SharedService{

    // used by publication and user to communicate sidebar it needs to update stats
    updateSignal: Subject<string> = new Subject();

    // used by sidebar to send the statCounters to profile
    statCounters: Subject<object> = new Subject();

    constructor() { }
}