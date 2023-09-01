import { Component } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/model/user';
import { CookieService } from "ngx-cookie-service";
import { Router, ActivatedRoute, Params } from '@angular/router'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UserService]
})
export class LoginComponent {

  public titulo: string;
  public status: string;
  public message: string;
  public user:any;
  public identity:any;
  public token:any;

  constructor(private _userService: UserService,
    private _cookies: CookieService,
    private _route: Router,
    private _ActidavtedRoutes: ActivatedRoute) {

    this.message = ''
    this.status = ''
    this.titulo = 'Login de usuarios'
    this.user = new User('', '', '', '', '', '', '');

  }


  onSubmit(form:any){

    this._userService.login(this.user, false).subscribe(

      res => {
      
        if (res.user.status == 'activo' && res.user._id) {

          this.identity = res

          this._cookies.set('identity', JSON.stringify(this.identity))

          this._userService.login(this.user, true).subscribe(
            response => {

              this.token = response.token
        
              this._cookies.set('token',this.token)           
              this._route.navigate(['/home'])

            },
            error => {
              this.status = 'error';
              console.log("res + error:", error)
            }
          )
          
        }else{

          this.status = 'error';
          this.message = 'Error';

        }
      
      },
      err => {
      
        this.status = 'error';
        this.message = err.error.message
       
      }
    )

  }

}
