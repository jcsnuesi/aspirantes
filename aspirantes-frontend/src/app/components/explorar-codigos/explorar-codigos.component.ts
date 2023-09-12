import { Component, OnInit, HostListener } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { global } from 'src/app/service/global';
import * as moment from 'moment';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Importa NoopAnimationsModule



@Component({
  selector: 'app-explorar-codigos',
  templateUrl: './explorar-codigos.component.html',
  styleUrls: ['./explorar-codigos.component.css'],
  providers: [UserService]
})
export class ExplorarCodigosComponent implements OnInit{
  public codigo:string;
  public codigosDisponibles;
  public token:string;
  public aspirantesGrupo:any;
  public url:any;
  public modalInfo:any;
  public modal:any;
  public fechanacimiento:any;
  public posicion:any;
  multi: any[] = [];

  // options
  view: [number, number] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Evaluaciones';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Puntuacion';
  legendTitle: string = 'Categorias';


  colorScheme:any = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA','#c91313']
  };

  constructor(private _userService: UserService){
  
    this.token = this._userService.getToken()
    this.url = global.url;

  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log('presssss')
    if (event.key === 'ArrowLeft') {
      this.aspirante(this.posicion - 1);
    } else if (event.key === 'ArrowRight') {
      this.aspirante(this.posicion + 1);
    }
  }


  ngOnInit(): void {

    

    this.codigo = 'Seleccionar codigo...'
    this._userService.getCodigos(this.token).subscribe(
      respo =>{

        if (respo.status ==  "success") {
          this.codigosDisponibles =  respo.grupos

        }
  
      },
      error =>{
        console.log(error)
      }
    )


    this._userService.getCodigos(this.token).subscribe(
      res => {

        var allgruops = []
        res.grupos.forEach((element, index) => {

          for (let index = 0; index < element.aspirantesId.length; index++) {
            allgruops.push(element.aspirantesId[index]);

          }


        });


        this.aspirantesGrupo = allgruops
      },
      error => {
        console.log(error)
      }
    )

      
  }

  buscarCodigo(event:any){
    const id = event.target.value

    this._userService.grupoCodigoById(id, this.token).subscribe(

      response => {

        this.aspirantesGrupo = response.grupos.aspirantesId


      }, err => {
        console.log(err)
      }
    )

   
  }


  aspirante(event:any){

    var anchorDom = document.querySelectorAll('a[href^="#"]')
 
    anchorDom.forEach((links) => {
      links.addEventListener("click", function (e) {
        e.preventDefault()
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
      
        if (targetElement) {

          // Usa el método scrollIntoView para desplazarse suavemente al elemento
          targetElement.scrollIntoView({ behavior: "smooth" });
        }

      })

      
    });
 
    
    var calendar = { Jan: "Enero", Feb: "Febrero", Marc: "Marzo", Apr: "Abril", May:"Mayo",
    Jun: "Junio", Jul: "Julio", Aug: "Agosto", Sep:"Septiembre",Oct:"Octubre",Nov:"Noviembre",Dic:"Diciembre"}
    


    this.modalInfo = this.aspirantesGrupo[event] 
    this.posicion = event

    var fn = (this.modalInfo.fecha_nacimiento).split("-");
    console.log(fn)
    
    this.fechanacimiento = fn[1] + " de " +  calendar[fn[0]] + " del " + fn[2]
    
         
    this.multi = [
      {
        "name": "Cultura General",
        "series": [
          {
            "name": "CG",
            "value": this.modalInfo.cg
          }
          
        ]
      },
      
      {
        "name": "Psicotécnicas",
        "series": [
          {
            "name": "PSICT",
            "value": this.modalInfo.psict
          }

        ]
      },
      {
        "name": "Promedio",
        "series": [
          {
            "name": "PROM",
            "value": this.modalInfo.prom
          }
          
        ]
      }
      ,
      
      {
        "name": "Fisico",
        "series": [
          {
            "name": "FS",
            "value": this.modalInfo.fisico
          }
          
        ]
      }
      
    ];
    
    
    
    this.modal = 'modal';
  }


  eliminarActualizar(event:any){

    var status = { 'estatus': 'inactivo', id: event.target.id}

    console.log(status, " ", this.token)
    this._userService.actualizarAspirante(status,  this.token).subscribe(

      res => {

        console.log(res)
        window.location.reload()

      },
      err =>{

      }
    )


  }
}
