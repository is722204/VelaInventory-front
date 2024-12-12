import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  unidadMedida="Kg"
  plants: any = [];
  //PARA LAS CARDS
  totalSalidas=0
  totalEntradas=0
  totalEficiencia=0
  totalInventarioInicial=0
  totalInventarioFinal=0

  selectedPlant = this.plants[0];
  selectedDay: any = new Date().toLocaleDateString('en-CA');

  registros:any=[]

  constructor(private api:ApiService,private router: Router) {
	const today = this.calendar.getToday();

    // Configura el primer día del mes actual
    this.fromDate = new NgbDate(today.year, today.month, 1);

    // Calcula el último día del mes actual
    const lastDayOfMonth = new Date(today.year, today.month, 0).getDate();
    this.toDate = new NgbDate(today.year, today.month, lastDayOfMonth);
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

  onSelectionChange() {
    const date = this.selectedDay.toString().split("-")
	console.log(this.fromDate,this.toDate, this.selectedPlant)
	localStorage.setItem("planta",JSON.stringify(this.selectedPlant))
	this.api.getDashboard(this.selectedPlant.id,`${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`,`${this.toDate.year}-${this.toDate.month}-${this.toDate.day}`).subscribe(res=>{
		console.log(res)
		this.registros=res
		this.totalInventarioInicial=this.registros[0].storage_init_kg || 0
		this.totalInventarioFinal=this.registros[this.registros.length-1].storage_end_kg || 0
		this.registros.forEach((element:any) => {
			this.totalSalidas+=element.portable_refill_kg 
			this.totalEntradas+=element.supplying_kg
			// this.totalInventarioInicial+=element.storage_init_kg
			// this.totalInventarioFinal+=element.storage_end_kg
		});
	})
  }





  exportDataToExcel(): void {
	const headers = [
	  [`REPORTE DE INVENTARIO ${this.selectedPlant.name.toUpperCase()}`],
	  [
		'Fecha',
		'Inventario inicial Sensor',
		'Descargas',
		'Cilindros',
		'Pipas',
		'Carburación',
		'Inventario Final Teórico',
		'Inventario Final Teórico CE',
		'Inventario Final Sensor',
		'DIF Final Teórico VS sensor',
		'DIF % Final Teórico VS sensor',
		'DIF Final Teórico CE VS sensor',
		'DIF %Final Teórico CE VS sensor',
	  ],
	];
  
	const numberFormatter = new Intl.NumberFormat('en-US', {
	  minimumFractionDigits: 3,
	  maximumFractionDigits: 3,
	});
  
	const data = this.registros.map((registro: any) => {
	  const inventarioInicialSensor = registro.storage_init_kg || 0;
	  const descargas = registro.supplying_kg || 0;
	  const cilindros = registro.portable_refill_kg || 0;
	  const pipas = registro.pipe_refill_kg || 0;
	  const carburacion = registro.carburation_kg || 0;
	  const inventarioFinalSensor = registro.storage_end_kg || 0;
  
	  // Cálculos de inventarios
	  const inventarioFinalTeorico =
		inventarioInicialSensor +
		descargas -
		registro.portable_refill_theorical_kg -
		pipas -
		carburacion;
  
	  const inventarioFinalTeoricoCE =
		inventarioInicialSensor +
		descargas -
		cilindros -
		pipas -
		carburacion;
  
	  const difFinalTeoricoVsSensor = inventarioFinalSensor - inventarioFinalTeorico;
  
	  const porcentajeFinalTeoricoVsSensor =
		inventarioFinalTeorico !== 0
		  ? ((inventarioFinalSensor / inventarioFinalTeorico) - 1) * 100
		  : 0;
  
	  const difFinalTeoricoCEVsSensor = inventarioFinalSensor - inventarioFinalTeoricoCE;
  
	  const porcentajeFinalTeoricoCEVsSensor =
		inventarioFinalTeoricoCE !== 0
		  ? ((inventarioFinalSensor / inventarioFinalTeoricoCE) - 1) * 100
		  : 0;
  
	  return [
		registro.supplying_date.toString().split('T')[0], // Fecha
		numberFormatter.format(Math.round(inventarioInicialSensor)) + ' Kg',
		numberFormatter.format(Math.round(descargas)) + ' Kg',
		numberFormatter.format(Math.round(cilindros)) + ' Kg',
		numberFormatter.format(Math.round(pipas)) + ' Kg',
		numberFormatter.format(Math.round(carburacion)) + ' Kg',
		numberFormatter.format(Math.round(inventarioFinalTeorico)) + ' Kg',
		numberFormatter.format(Math.round(inventarioFinalTeoricoCE)) + ' Kg',
		numberFormatter.format(Math.round(inventarioFinalSensor)) + ' Kg',
		numberFormatter.format(Math.round(difFinalTeoricoVsSensor)) + ' Kg',
		numberFormatter.format(Math.round(porcentajeFinalTeoricoVsSensor)) + ' %',
		numberFormatter.format(Math.round(difFinalTeoricoCEVsSensor)) + ' Kg',
		numberFormatter.format(Math.round(porcentajeFinalTeoricoCEVsSensor)) + ' %',
	  ];
	});
  
	const worksheetData = [...headers, ...data];
	const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, 'INVENTARIO');
  
	const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
	const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
	FileSaver.saveAs(
	  blob,
	  `ReporteDeInventario_${this.selectedPlant.name}_${new Date()
		.toISOString()
		.split('T')[0]}.xlsx`
	);
  }
  
  
  
  
  


































  calendar = inject(NgbCalendar);
	formatter = inject(NgbDateParserFormatter);

	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null = this.calendar.getToday();
	toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 10);

	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
		if(this.fromDate && this.toDate){
			this.onSelectionChange()
		}

	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}

















}
