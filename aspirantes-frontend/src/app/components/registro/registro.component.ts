import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { global } from 'src/app/service/global';

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
  public afuConfig:any;
  public url:string;

  constructor(private _userService: UserService){

    this.message = ''
    this.status = ''
    this.titulo = 'Registro de usuarios'
    this.user = new User('','','','','','','');
    this.url = global.url;

    this.afuConfig = {
      multiple: false,
      formatsAllowed: ".jpg,.jpeg,.png,.gif",
      maxSize: "50",
      uploadAPI: {
        url: this.url +'subir-avatar',
        method: "POST",
        itemAlias: 'file0',
        headers: {
        
          "Authorization": this._userService.getToken()
        }
       

      },

      theme: "attachPin",
      hideProgressBar: true,
      hideResetBtn: true,
      hideSelectBtn: true,
      fileNameIndex: true,
      autoUpload: false,
      replaceTexts: {

        attachPinBtn: 'Import .csv file to predict...',
        afterUploadMsg_success: 'Successfully Uploaded !',
        afterUploadMsg_error: 'Upload Failed !',
        sizeLimit: 'Size Limit'
      }

    }
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

  predictUpload(event:any){
    var respuesta = event.body
    console.log(respuesta)
  }

}
