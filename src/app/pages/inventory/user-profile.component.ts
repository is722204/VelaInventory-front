import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  plants: any = [];
  totalLitrosIniciales=0;
  totalKilosIniciales=0
  totalLitrosFinales=0
  totalKilosFinales=0

  //VARIABLES PARA SUMATORIAS
  inventarioInicial={
    kilosSensor:0,
    litrosSensor:0
  }

  selectedPlant = this.plants[0];
  selectedDay: any = new Date(new Date().getTime()-86400000).toLocaleDateString('en-CA');

  storages: any = []

  chart: any;

  historicalData = [
    { date: '2024-11-01', percentage: 45 },
    { date: '2024-11-05', percentage: 50 },
    { date: '2024-11-10', percentage: 55 },
    { date: '2024-11-15', percentage: 60 },
    { date: '2024-11-20', percentage: 58 }
  ];

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
    this.storages = []
    this.totalLitrosIniciales=0;
    this.totalKilosIniciales=0
    this.totalLitrosFinales=0
    this.totalKilosFinales=0

    this.api.getStorageByPlant(id_plant, year, month, day).subscribe((res:any) => {
      console.log(res)
      this.storages = res.sort((a, b) => a.name.localeCompare(b.name));
      res.forEach(element => {
        this.totalLitrosIniciales+=element.init_liters;
        this.totalKilosIniciales+=element.init_kg
        this.totalLitrosFinales+=element.end_liters
        this.totalKilosFinales+=element.end_kg

      });
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
    
  showSupplyChart(imei): void {
    const [year, month, day] = this.selectedDay.toString().split("-").map(Number);
    const init=new Date(`${month}/${day}/${year}`)
    const end=new Date(`${month}/${day}/${year}`)
    this.api.getChartByImei(imei,init.getTime()-3600000,end.setHours(23,59,59,99)+3600000).subscribe((res:any)=>{
      res.reverse()
      Swal.fire({
        title: 'Histórico Porcentaje vs Tiempo',
        html: '<canvas id="supplyChart" style="width:100%; height:300px;"></canvas>',
        showCancelButton: true,
        confirmButtonText: 'Cerrar',
        didOpen: () => {
          // Generar el gráfico cuando el modal esté abierto
          const labels = res.map(item => new Date(parseInt(item.timestamp)).toLocaleTimeString());
          const data = res.map(item => item.level_percentage);
  
          const ctx = document.getElementById('supplyChart') as HTMLCanvasElement;
          new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'Porcentaje (%)',
                  data: data,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  fill: true,
                  tension: 0.4
                }
              ]
            },
            options: {
              responsive: true,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Fecha'
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Porcentaje (%)'
                  },
                  beginAtZero: true,
                  max: 100
                }
              }
            }
          });
        }
      });
    })
    // Crear el modal de SweetAlert2

  }




  onEditSupply(){
  }


}
