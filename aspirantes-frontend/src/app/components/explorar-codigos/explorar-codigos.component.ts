import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { global } from 'src/app/service/global';
import * as moment from 'moment';


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

      
  }

  buscarCodigo(event:any){
    const id = event.target.value
    

    this._userService.grupoCodigoById(id,this.token).subscribe(

      response=>{

        this.aspirantesGrupo = response.grupos.aspirantesId


        console.log(this.aspirantesGrupo)
      },err =>{
        console.log(err)
      }
    )
  }

  aspirante(event:any){
    this.modal = 'modal';


    this.modalInfo = this.aspirantesGrupo[event] 
    this.posicion = event
   
    
    this.fechanacimiento = moment(this.modalInfo.fecha_nacimiento).format('dddd, D [de] MMMM [de] YYYY');

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


    console.log(this.aspirantesGrupo[event])
  }
}
