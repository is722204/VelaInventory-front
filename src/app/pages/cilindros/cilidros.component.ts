import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cilindros',
  templateUrl: './cilindros.component.html',
  styleUrls: ['./cilindros.component.scss']
})
export class CilindrosComponent implements OnInit {
  plants: any = [];
  cilindrosData: any[] = []; // Aquí estarán tus datos procesados

  // Método para obtener las claves de los encabezados
  getHeaders(): string[] {
    return this.cilindrosData.length > 0 ? Object.keys(this.cilindrosData[0]) : [];
  }
  selectedPlant = this.plants[0];
  selectedDay: any = new Date(new Date().getTime()-86400000).toLocaleDateString('en-CA');

  cilindros: any = []
  constructor(private api: ApiService) { }

  onSelectionChange() {
    const date = this.selectedDay.toString().split("-")
    localStorage.setItem("planta",JSON.stringify(this.selectedPlant))
    this.getSupplyByPlant(this.selectedPlant.id, date[0], date[1], date[2])
  }


  ngOnInit() {
    this.api.getPlants().subscribe(res => {
      this.plants = res
	  if(localStorage.getItem("planta")){
		this.selectedPlant=this.plants[this.plants.findIndex(e=>{return e.id==JSON.parse(localStorage.getItem("planta")).id})]
	  }else{
		this.selectedPlant = this.plants[0]
	  }
      
      this.onSelectionChange()
    })
  }

  getSupplyByPlant(id_plant, year, month, day) {
    this.cilindros = []
    this.api.getCilindrosByPlant(id_plant, year, month, day).subscribe(res => {
      this.cilindros = res
    })
    // try {
    //   this.mostrarTablaPegasus(id_plant, year, month, day)
    // } catch (error) {
      
    // }
  }

  addSupplying() {
    this.api.getPGS().subscribe((res: any) => {
      const tanks = res.map(
        tank => `<option value="${tank.id}">${tank.name}</option>`
      ).join('');
  
      Swal.fire({
        title: 'Agregar Abastecimiento',
        html: `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <select id="id_tank" class="swal2-input">
              <option value="">Seleccione un tanque</option>
              ${tanks}
            </select>
            <input id="kg" class="swal2-input" placeholder="Kg Carta Porte" type="number">
            <input id="liters" class="swal2-input" placeholder="90% Litros" type="number">
          </div>`,
        confirmButtonText: 'Agregar',
        showCancelButton: true,
        preConfirm: () => {
          const id_plant = this.selectedPlant.id;
          const id_tank = (document.getElementById('id_tank') as HTMLInputElement).value;
          const percentage = 100
          const liters = parseFloat((document.getElementById('liters') as HTMLInputElement).value);
          const kg = parseFloat((document.getElementById('kg') as HTMLInputElement).value);
  
          if (!id_plant || !id_tank || isNaN(percentage) || isNaN(liters) || isNaN(kg)) {
            Swal.showValidationMessage('Todos los campos son obligatorios y deben ser válidos');
            return;
          }
  
          const [year, month, day] = this.selectedDay.toString().split("-").map(Number);
  
          return { id_plant, year, month, day, id_tank: parseInt(id_tank), percentage, liters, kg };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const supplyingData = result.value;
          this.api.addSupplyByPlant(
            supplyingData.id_plant,
            supplyingData.id_tank,
            supplyingData.year,
            supplyingData.month,
            supplyingData.day,
            supplyingData.percentage,
            supplyingData.liters,
            supplyingData.kg
          ).subscribe(res => {
            window.location.reload()
          });
        }
      });
    });
  }
    
  
  onDeleteSupply(id_supply){
    Swal.fire({
      icon:"warning",
      title:"Atención",
      text:"¿Estás seguro de eliminar este abastecimiento? esta acción no se podrá revertir"
    }
    ).then(res=>{
      if(res.isConfirmed){
        this.api.deleteSupplyByPlant(this.selectedPlant.id,id_supply).subscribe(res=>{
          window.location.reload()
        })
      }
    })
  }

  onEditSupply(){
  }

  mostrarTablaPegasus(id_plant,year,month,day){
    const plantas=["","altos","zapopan","atequiza","autlan","cocula","guzman","tecolotlan","cihuatlan"]
    this.cilindrosData = []; // limpiar el arreglo
    try {
      this.api.getCilindrosPegasus(plantas[id_plant], `${year}-${month}-${day}`).subscribe((res: string) => {
        // Dividir el texto en líneas
        const lines = res.split('\n');
    
        // Ignorar las primeras líneas y obtener los encabezados (línea 3 en este caso)
        const headers = lines[2].split(',').map((header) => header.trim().replace(/"/g, ''));
    
        // Procesar las líneas de datos (a partir de la línea 4)
        const data = lines.slice(3).map((line) => {
          const values = line.split(',');
          if (values.length === headers.length) { // Validar que la línea tiene datos completos
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = values[index]?.trim().replace(/"/g, ''); // Mapear encabezados con valores
            });
            return obj;
          }
          return null; // Ignorar líneas incompletas
        }).filter((item) => item !== null); // Eliminar los valores nulos
    
        console.log('Datos procesados:', data);
    
        // Aquí podrías asignarlo a una variable para mostrarlo en el front
        this.cilindrosData = data;
        console.log(this.cilindrosData)
      });
    } catch (error) {
      console.log(error)
    }
  }

  

 
}
