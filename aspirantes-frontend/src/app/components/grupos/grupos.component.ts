import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css'],
  providers: [UserService]
})
export class GruposComponent implements OnInit{
 public codigox:string;
 public mgs:string;
 public token:string;
 public status:any;
 public codigoList:any;
 public male:any[] = []; 
 public female: any[] = [];



  constructor(private _userService:UserService){
    
    this.codigox = ''
    this.mgs = ''
    this.token = this._userService.getToken()
  }

  ngOnInit(): void {
      this._userService.getCodigos(this.token).subscribe(
        res => {

          this.codigoList = res.grupos

         

          for (let index = 0; index < (res.grupos).length; index++ ) {
            
            if ((res.grupos[index].codigo).startsWith('M')) {

           
              this.male.push({ codigo: res.grupos[index].codigo, total: (res.grupos[index].aspirantesId).length })

            } else if ((res.grupos[index].codigo).startsWith('F')){
            
            

              this.female.push({ codigo: res.grupos[index].codigo, total: (res.grupos[index].aspirantesId).length })

            }
            
          }
          console.log(this.female)
          // console.log(this.female)
       
        },
        error=>{
          console.log(error)
        }
      )
  }

  onSubmit(form:any){

    this._userService.crearCodigo(form.form.value,this.token).subscribe(
    response => {
      
        if (response.status == 'success') {
          this.status = 'success'
          form.reset()
          window.location.reload()
          
      }else{
          this.status = 'error'
          this.mgs = 'Error'
         
      }
        
      
    },
    error=> {
      this.status = 'error'
      this.mgs = error.error.message
      
      
    }
    )
   
  }



}
