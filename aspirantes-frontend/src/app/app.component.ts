import { Component, DoCheck, OnInit } from '@angular/core';
import { global } from './service/global';
import { UserService } from './service/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {
  public title = 'aspirantes-frontend';
  public url:string;
  public identity: any;

  constructor(

    private _userService: UserService,
    private _route: Router,
  ){
   
    this.url = global.url;
    this.identity = this._userService.getIdentidad() || false
  }

  ngOnInit(): void {
    this.identity
   
  }

  ngDoCheck(): void {
      this.identity = this._userService.getIdentidad()

  }

  sessionDestroy(){
    this._userService.cookiesDestroy()
    this._route.navigate(['/home'])
  }
}
