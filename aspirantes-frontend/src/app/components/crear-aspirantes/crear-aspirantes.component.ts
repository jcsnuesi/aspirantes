import { Component, OnInit } from '@angular/core';
import { Aspirantes } from 'src/app/model/aspirantes';
import { global } from 'src/app/service/global';
import { UserService } from 'src/app/service/user.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-crear-aspirantes',
  templateUrl: './crear-aspirantes.component.html',
  styleUrls: ['./crear-aspirantes.component.css'],
  providers: [UserService]
})
export class CrearAspirantesComponent implements OnInit{

  public codigoLetra:string;
  public titulo:string;
  public aspirante:any;
  public afuConfig:any;
  public successf: any;
  public spinner: any;
  public clase: any;
  public message: string;
  public url: string;
  public foto: string | ArrayBuffer | null = null;
  public token:string;
  public archivos:any  = [] ;
  public status:any;
  public indexFuncion:any;
  formData: FormData = new FormData();

  
  

  constructor(private _userServices:UserService,
    private _router: Router,
    private _activateRoute: ActivatedRoute, private sanitizer: DomSanitizer){
    this.foto = '../../../assets/image/noimg.png'
    this.url = global.url;
    this.successf = false
    this.message = ''
    this.codigoLetra = "F"
    this.titulo = "Crear aspirante"
    this.formData = new FormData();
    this.indexFuncion = 0

    
    this.aspirante = new Aspirantes('', '', '', '', '', new Date, 0, '', '', '', '', '', '', '', '', '', '', '',0,0,0,'',0,'',''); 

    this.aspirante.medicos = 'Seleccionar...'
    this.aspirante.psic = 'Seleccionar...'
    this.token = this._userServices.getToken()
   
    

  }

  ngOnInit(): void {



    this._activateRoute.params.subscribe((params) => {
       const codigo =  params['id']
    
      if (codigo.length > 2) {
    
       this._userServices.getAspirante(codigo,this.token).subscribe(
          res => {
         
            if (res.status == 'success') {
              this.indexFuncion = 1
              this.titulo = 'Actualizar aspirante'
              var calendar = {
                Jan: '01', Feb: '02', Marc:'03', Apr: '04', May: '05',
                Jun: '06', Jul: '07', Aug: '08', Sep:'09', Oct: '10', Nov: '11', Dic: '12'
              }
              
              this.foto = res.usuario.avatar
              this.aspirante = res.usuario
              var fechan = res.usuario.fecha_nacimiento
              this.aspirante.fecha_nacimiento = fechan.split("-")[2] + "-" + calendar[fechan.split("-")[0]] + "-" + fechan.split("-")[1]
              this.formData.append('avatar',res.usuario.avatar)
          
            }

       
          },
          error => {
            console.log(error)
          }
        )
        
       }else{

        this._userServices.grupoCodigo(codigo, this.token).subscribe(
          res => {
          
            this.aspirante.codigo = codigo + '-' + (res.total + 1)
            console.log(codigo)
            console.log(res.total)
          },
          error => {
            console.log(error)
          }

        )

     
        

       }
     

    })
   
  }

  fillAge(event:any){

    var fechaN = (event.target.value).split('-')
    // Crear objetos Date para las dos fechas
    const fechaNacimiento = new Date(`${fechaN[1]}-${fechaN[2]}-${fechaN[0]}`);
    const fechaActual = new Date();
  

    // Calcular la diferencia en años
    var diferenciaEnAnios = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    this.aspirante.edad = diferenciaEnAnios 

    if (
      fechaActual.getMonth() < fechaNacimiento.getMonth() ||
      (fechaActual.getMonth() === fechaNacimiento.getMonth() && fechaActual.getDate() < fechaNacimiento.getDate())
    ) {
      diferenciaEnAnios--;
    }
    

  }

  public onFileSelected(event: any) {
    

    const imagen = event.target.files[0];
   
    let extension = ['jpg', 'jpeg', 'gif', 'png'];

    
    if (extension.includes(imagen.type.split('/')[1])) {
      
      console.log('Si es una imagen');
      
      this.blobFile(imagen).then((res: any) => {
      this.foto = res.base;
      
   

      })
      this.formData.append('avatar',imagen)
      
    } else {
      console.log('No es imagen');

    }
  }

  blobFile = async ($event: any) => new Promise((resolve:any, reject:any) => {

    try {
      const unsafeImg = window?.URL?.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();

      reader.readAsDataURL($event);
      reader.onload = () => {
         resolve({
         
          base: reader?.result
        });
      };
      reader.onerror = error => {
           resolve({
        
          base: null
        });
      };

      return true
    } catch (e) {
      
      return null;
    }
  })



  onSubmit(form: any) {
   
    try {
       
     
      for (const key in this.aspirante) {

        if(key == 'avatar'){
          continue
        }else{
          this.formData.append(`${key}`, this.aspirante[key])
             
        }
          
      }
     
    
      if (this.indexFuncion != 1) {
        
        this._userServices.crearAspirante(this.formData, this.token).subscribe(
          res => { 
  
            if (res.status == 'success') {
  
              this.status = 'success';
              this.foto = '../../../assets/image/noimg.png'
  
              
  
              setTimeout(() => {
                window.location.reload()
              }, 3000);
             
            }else{
  
              this.status = 'error'
  
            }
            
          },
          err => {
            this.status = 'error'
            console.log(err)
          }
        )
      }else{
        console.log(form.value)
        this._userServices.actualizarAspirante( this.aspirante, this.token).subscribe(
          res => { 
  
            if (res.status == 'success') {
  
              this.status = 'success';
              this.foto = '../../../assets/image/noimg.png'
  
              setTimeout(() => {
                window.location.reload()
              }, 3000);
             
            }else{
  
              this.status = 'error'
  
            }
            
          },
          err => {
            this.status = 'error'
            console.log(err)
          }
        )
      }
    

      
    } catch (error) {

      console.log(error)
      
    }
      
    
  }

  spinnerGet() {
    return this.spinner
  }

  spinnserSet(spinner: boolean) {

    this.spinner = spinner
  }

  updateAspirante(){

    this._userServices.actualizarAspirante(this.aspirante,this.token).subscribe(

    response => {
      console.log(response)
    },
    error => {
      console.log(error)
    }
    )

  }  
       
  }

  


  
