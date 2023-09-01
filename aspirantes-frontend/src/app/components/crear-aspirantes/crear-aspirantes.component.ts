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
  
  

  constructor(private _userServices:UserService,
    private _router: Router,
    private _activateRoute: ActivatedRoute, private sanitizer: DomSanitizer){
    this.foto = '../../../assets/image/noimg.png'
    this.url = global.url;
    this.successf = false
    this.message = ''
    this.codigoLetra = "F"
    this.titulo = "Crear aspirante"
    this.aspirante = new Aspirantes('', '', '', '', '', new Date, 0, '', '', '', '', '', '', '', '', '', '', '',0,0,0,'',0,'',''); 

    this.token = this._userServices.getToken()
    this.afuConfig = {
      multiple: false,
      formatsAllowed: ".jpg, .jpeg, .png, .gif", 
      maxSize: "50",
      uploadAPI: {
        url: "http://localhost:3992/api/actualizar-avatar",
        method: "PUT",
        itemAlias: 'avatar'

      },

      theme: "attachPin",
      hideProgressBar: false,
      hideResetBtn: true,
      replaceTexts: {

        attachPinBtn: 'Import file...',
        afterUploadMsg_success: 'Successfully Uploaded !',
        afterUploadMsg_error: 'Upload Failed !',
        sizeLimit: 'Size Limit'
      }

    }

  }

  ngOnInit(): void {

    this.aspirante.colorpiel = "Seleccionar Piel...."
    this.aspirante.colorpelo = "Seleccionar color Pelo...."
    this.aspirante.constitucionFisica = "Seleccionar fisico...."

    this._activateRoute.params.subscribe(params => {
       const codigo =  params['id']
      
      this._userServices.grupoCodigo(codigo, this.token).subscribe(
        res => {

          this.aspirante.codigo = codigo + '-'+ res.total
          
       
        },
        error => {
          console.log(error)
        }

      )
      this.aspirante.codigo = codigo[0] +'-'+ (parseInt(codigo[1])  + 1)
      this.aspirante.sexo = codigo[0].substring(0,1)

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

      this.archivos.push(imagen)
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
      
      const formData = new FormData();    
      
      for (const key in this.aspirante) {
        if (key == 'avatar') {

          this.archivos.forEach(file => {
            formData.append(`${key}`, file)          
            
          });
          
        }else{
          formData.append(`${key}`, this.aspirante[key])
        }
       
      }

      console.log(this.aspirante)
     

      this._userServices.crearAspirante(formData, this.token).subscribe(
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

  predictUpload(eve: any = "") {


    this.spinnserSet(true)
    console.log(this.spinner)

    const res = (eve: any) => {

      var hide = document.getElementById('filer')
      hide?.setAttribute('hidden', 'hidden')




      if (eve.status == 200) {

        this.spinnserSet(false)
        this.clase = { 'alert alert-success': true }

        console.log(eve)
        var data_obj = eve.body
        data_obj.accurancy
        // this.foto = this.url + 'avatar/' + eve.
        this.successf = true
        this.message = data_obj.success

        hide?.removeAttribute('hidden')

      } else if (eve.status == 400) {

        this.spinnserSet(false)
        this.clase = { 'alert alert-danger': true }

        this.message = eve.error.error
        hide?.removeAttribute('hidden')




      }



    }



    eve.onchage = res(eve)

  }
       
  }

  


  
