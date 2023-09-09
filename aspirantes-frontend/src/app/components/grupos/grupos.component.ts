import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { Aspirantes } from 'src/app/model/aspirantes';
import { global } from 'src/app/service/global';
import * as XLSX from 'xlsx';
import { parse, addDays } from 'date-fns';

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
 public changer:string;
 public afuConfig:any;
 public excelData: any[][] = [];
 public excelDateNumber:any;
 public aspirante:any;



  constructor(private _userService:UserService){
    
    this.codigox = ''
    this.mgs = ''
    this.changer = ''
  
    this.aspirante = new Aspirantes('', '', '', '', '', new Date, 0, '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0, '', 0, '', ''); 

    this.token = this._userService.getToken()
  
    

  }


  ngOnInit(): void {
      this._userService.getCodigos(this.token).subscribe(
        res => {

          this.codigoList = res.grupos
                   
      
          for (let index = 0; index < (res.grupos).length; index++ ) {

          
            if ((res.grupos[index].codigo).startsWith('M')) {
            

              this.male.push({ codigo: res.grupos[index].codigo, total: (res.grupos[index].aspirantesId).length  })
        
            } 
            
            if ((res.grupos[index].codigo).startsWith('F')){
            
            
              this.female.push({ codigo: res.grupos[index].codigo, total: (res.grupos[index].aspirantesId).length })
            
            }
            
          }
     
          console.log(this.codigoList)
     
       
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

  mode(event:any){


    this.changer = event.target.id
    
    


  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      this.excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    };
  
    reader.readAsBinaryString(file);


    

  }

  processFile(): void {
    
    var columnas = this.excelData[0]
    var arrDatos = []
    
    
    for (let index = 1; index < this.excelData.length; index++) {
      var datos = {}      
      var incremento = 0

      while (incremento < this.excelData[index].length) {

        if (columnas[incremento] == 'fecha_nacimiento') {

          const excelDate = new Date(1900, 0, (this.excelData[index][incremento] - 1));
          const calendarDate = addDays(excelDate, 0);
          var dateSplit = (calendarDate.toString()).split(" ")

          datos[columnas[incremento]] = dateSplit[1] + "-" + dateSplit[2] + "-" + dateSplit[3]

        } else if (columnas[incremento] == 'fisico'){

          datos[columnas[incremento]] = (typeof this.excelData[index][incremento] != 'string') ? parseInt(this.excelData[index][incremento])   : 0
        }
        else {

          datos[columnas[incremento]] = (this.excelData[index][incremento] != undefined) ? this.excelData[index][incremento] : 'NA'
        }

       

        incremento++

      }

      if (Object.keys(datos).length == 0) {
        break;
      }
     arrDatos.push(datos)

     

    }
 
    console.log(arrDatos)
    this._userService.crearAspirante(arrDatos, this.token).subscribe(
      res => {

        console.log(res)
      },
      error=>{
        console.log(error)
      }
    )
 

   

  }

}
