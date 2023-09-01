import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  providers: [UserService]
})
export class RegistroComponent implements OnInit{

  public titulo: string;
  public user:any;
  public status: string;
  public message:string;

  constructor(private _userService: UserService){

    this.message = ''
    this.status = ''
    this.titulo = 'Registro de usuarios'
    this.user = new User('','','','','','','');
  }

  ngOnInit(): void {
      
  }

  onSubmit(form:any){

    this._userService.registrarUsuario(this.user).subscribe(

      res => {
        if (res.status == 'success') {

          this.status = 'success';
          this.message = 'Usuario creado exitosamente.'
          form.reset()
          
        }else{
          this.status = 'error';
          this.message = res.message

        }
      },
      error => {
        this.status = 'error';
        this.message = error.error.message
      }
    )

   
  }

}
