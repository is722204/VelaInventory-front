import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carburacion',
  templateUrl: './carburacion.component.html',
  styleUrls: ['./carburacion.component.scss']
})
export class CarburacionComponent implements OnInit {
  plants: any = [];

  selectedPlant = this.plants[0];
  selectedDay: any;

  carburaciones: any = []
  constructor(private api: ApiService) { }

  onSelectionChange() {
    const date = this.selectedDay.toString().split("-")
    localStorage.setItem("planta",JSON.stringify(this.selectedPlant))
    localStorage.setItem("date",JSON.stringify(this.selectedDay.toString()))
    this.getSupplyByPlant(this.selectedPlant.id, date[0], date[1], date[2])
  }


  ngOnInit() {
    this.api.getPlants().subscribe(res => {
      this.plants = res
      const selectedPlantId = JSON.parse(localStorage.getItem("planta"))?.id;
      this.selectedPlant = this.plants.find(plant => plant.id === selectedPlantId) || this.plants[0];
      
      const date = localStorage.getItem("date")
      if(date){
        this.selectedDay = new Date(date).toLocaleDateString('en-CA')
      }
      else {
        this.selectedDay = new Date(new Date().getTime()-86400000).toLocaleDateString('en-CA');
      }
      
      this.onSelectionChange()
    })
  }

  getSupplyByPlant(id_plant, year, month, day) {
    this.carburaciones = []
    this.api.getCarburationByPlant(id_plant, year, month, day).subscribe(res => {
      this.carburaciones = res
    })
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

 
}
