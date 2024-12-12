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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public copy: string;
  projects:any=[]
  projectSelected:any=""

  versions:any=[]
  versionSelect=""

  details:any=""
  constructor(private api:ApiService) { }

  ngOnInit() {
    this.api.getProjects(localStorage.getItem("token")).subscribe(res=>{
      this.projects=res
    })
  }
  onProjectSelect(project:any){
    this.projectSelected=project
    this.api.getVersions(localStorage.getItem("token"),project).subscribe((res:any)=>{
      this.versions=res.reverse()
    })
  }
  onVersionSelect(version:any){
    this.versionSelect=version
    this.details=version.features
  }

  addProject(){
    Swal.fire({
      title: 'Agregar Proyecto y Versión',
      html:
        `<input id="projectName" class="swal2-input" placeholder="Nombre del proyecto">
         <input id="version" class="swal2-input" placeholder="Versión">
         <input id="features" class="swal2-input" placeholder="Detalles">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const projectName = (<HTMLInputElement>document.getElementById('projectName')).value;
        const version = (<HTMLInputElement>document.getElementById('version')).value;
        const features = (<HTMLInputElement>document.getElementById('features')).value;

        if (!projectName || !version || !features) {
          Swal.showValidationMessage('Por favor, completa todos los campos');
        }

        return { projectName, version, features };
      }
    }).then(result => {
      if (result.isConfirmed) {
        // Aquí puedes enviar los datos del proyecto al backend
        console.log('Proyecto:', result.value.projectName);
        console.log('Versión:', result.value.version);
        console.log('Detalles:', result.value.features);
        
        this.api.addProject(localStorage.getItem("token"),result.value.projectName,result.value.version,result.value.features).subscribe(response => {
          console.log(response);
          window.location.reload()
        });
      }
    });
  }

  addVersion(){
    //Agregar una version
    Swal.fire({
      title: 'Agregar Versión',
      html:
        `<input id="version" class="swal2-input" placeholder="Número de versión">
         <input id="features" class="swal2-input" placeholder="Características">
         <select id="prod" class="swal2-select">
           <option value="yes">Producción</option>
           <option value="no">Versión vieja</option>
         </select>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const version = (<HTMLInputElement>document.getElementById('version')).value;
        const features = (<HTMLInputElement>document.getElementById('features')).value;
        const prod = (<HTMLSelectElement>document.getElementById('prod')).value;

        if (!version || !features || !prod) {
          Swal.showValidationMessage('Por favor, completa todos los campos');
        }

        return { version, features, prod };
      }
    }).then(result => {
      if (result.isConfirmed) {
        // Aquí puedes hacer la llamada al backend para enviar los datos
        this.api.addVersion(localStorage.getItem("token"),this.projectSelected,result.value.version,result.value.features,result.value.prod).subscribe(response => {
          window.location.reload()
        });
      }
    });
  }



}
