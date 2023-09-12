import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { parse, addDays } from 'date-fns';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-actualizar-por-grupos',
  templateUrl: './actualizar-por-grupos.component.html',
  styleUrls: ['./actualizar-por-grupos.component.css'],
  providers:[UserService]
})
export class ActualizarPorGruposComponent {

  public excelData:any;
  public token:string;

  constructor(private _userService:UserService){

    this.token = this._userService.getToken()
    
    
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    const btnFileSub = document.getElementById('fileSub')
    btnFileSub.removeAttribute('disabled')

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
 
    this._userService.actualizarAspiranteFile(arrDatos, this.token).subscribe(
      res => {

        console.log(res)
      },
      error=>{
        console.log(error)
      }
    )
 
  }



}
