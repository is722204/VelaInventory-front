import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent implements OnInit {
  plants: any = [];

  selectedPlant = this.plants[0];
  selectedDay: any = new Date(new Date().getTime()-86400000).toLocaleDateString('en-CA');

  supplyies: any = []
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
    this.supplyies = []
    this.api.getSupplyByPlant(id_plant, year, month, day).subscribe(res => {
      this.supplyies = res
    })
  }

  addSupplying() {
    Swal.fire({
      title: 'Agregar Abastecimiento',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <input id="folio" class="swal2-input" placeholder="Folio" type="text">
          <input id="transport" class="swal2-input" placeholder="Transporte" type="text">
          <input id="kgCartaPorte" class="swal2-input" placeholder="KG Carta Porte" type="number">
          <input id="kgRI" class="swal2-input" placeholder="KG RI" type="number">
        </div>`,
      confirmButtonText: 'Agregar',
      showCancelButton: true,
      preConfirm: () => {
        const folio = (document.getElementById('folio') as HTMLInputElement).value.trim();
        const transport = (document.getElementById('transport') as HTMLInputElement).value.trim();
        const kgCartaPorte = parseFloat((document.getElementById('kgCartaPorte') as HTMLInputElement).value);
        const kgRI = parseFloat((document.getElementById('kgRI') as HTMLInputElement).value);
  
        if (!folio || !transport || isNaN(kgCartaPorte) || isNaN(kgRI)) {
          Swal.showValidationMessage('Todos los campos son obligatorios y deben ser válidos');
          return;
        }
  
        return { folio, transport, kgCartaPorte, kgRI };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const supplyingData = result.value;
        // Aquí puedes agregar la lógica para enviar los datos a tu API o manejarlos como prefieras
        console.log('Datos enviados:', supplyingData);
  
        // Ejemplo de petición a la API (ajusta según tu implementación)
        const date = this.selectedDay.toString().split("-")
        this.api.addSupplyByPlant(
          this.selectedPlant.id,
          date[0],
          date[1],
          date[2],
          supplyingData.folio,
          supplyingData.transport,
          supplyingData.kgCartaPorte,
          supplyingData.kgRI
        ).subscribe(res => {
          Swal.fire('Éxito', 'El abastecimiento ha sido agregado', 'success');
          window.location.reload();
        });
      }
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
