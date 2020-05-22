import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import { MessageService} from './services/message.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, MessageService]
})
export class AppComponent implements OnInit, DoCheck {
  public title: string;
  public identity;
  public token;
  public url;
  public nonReadCount;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _messageService: MessageService
  ){
    this.title = 'sns-client';
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    if(this.token){
      this.nonReadCount = this.getNonReadCounter();
    } 
  }

  // When something changes in the component, executes the content
  ngDoCheck(){
    this.identity = this._userService.getIdentity();
    //this.nonReadCount = this.getNonReadCounter();
  }

  logout(){
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/']);
  }

  getNonReadCounter(){
    this._messageService.getNonReadCounter(this.token).subscribe(
      response => {
        if (response.nonRead){
          this.nonReadCount = response.nonRead;
          console.log(this.nonReadCount);
        }
      },
      error => {
        let errorMessage = <any>error;
        console.log(errorMessage);
      }
    ); 
  }

}
