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

  isLitros: boolean = false; // Variable que refleja el estado del checkbox
  isDisabled: boolean = true; // Controla si el checkbox está deshabilitado
  
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
		this.totalSalidas=0 
		this.totalEntradas=0
		this.registros=res
		this.totalInventarioInicial=this.registros[0].storage_init_kg || 0
		this.totalInventarioFinal=this.registros[this.registros.length-1].storage_end_kg || 0
		this.registros.forEach((element:any) => {
			//Tomar en cuenta que se está redondeando sin decimales
			this.totalSalidas+=parseFloat(parseFloat(element.portable_refill_theorical_kg).toFixed(2))
			this.totalSalidas+=parseFloat(parseFloat(element.pipe_refill_kg ).toFixed(0))
			this.totalSalidas+=parseFloat(parseFloat(element.carburation_kg ).toFixed(0))
			this.totalEntradas+=parseFloat(parseFloat(element.supplying_kg).toFixed(0))
		});
	})
  }

  toggleCheckbox(): void {
	this.isLitros = !this.isLitros;
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
		'Inventario Final s/alm',
		'Inventario Final c/alm',
		'Almacén',
		'% Almacén',
	  ],
	];
  
	const numberFormatter = new Intl.NumberFormat('en-US', {
	  minimumFractionDigits: 0,
	  maximumFractionDigits: 0,
	});
	const numberFormatter2 = new Intl.NumberFormat('en-US', {
	  minimumFractionDigits: 0,
	  maximumFractionDigits: 1,
	});
  
	const data = this.registros.map((registro: any) => {
	  const inventarioInicialSensor = registro.storage_init_kg || 0;
	  const descargas = registro.supplying_kg || 0;
	  const cilindros = registro.portable_refill_theorical_kg || 0;
	  const pipas = registro.pipe_refill_kg || 0;
	  const carburacion = registro.carburation_kg || 0;
	  const inventarioFinalSensor = registro.storage_end_kg || 0;
  
	  // Cálculo de Inventario Final s/alm (sin almacén)
	  const inventarioFinalSinAlm =
		inventarioInicialSensor + descargas - cilindros - pipas - carburacion;
  
	  // Cálculo de Almacén
	  const almacen = inventarioFinalSensor - inventarioFinalSinAlm;
  
	  // Cálculo del % Almacén
	  const porcentajeAlmacen =
		(cilindros + pipas + carburacion) !== 0
		  ? (almacen / (cilindros + pipas + carburacion)) * 100
		  : 0;
  
	  return [
		registro.supplying_date.toString().split('T')[0], // Fecha
		numberFormatter.format(inventarioInicialSensor) + ' Kg',
		numberFormatter.format(descargas) + ' Kg',
		numberFormatter.format(cilindros) + ' Kg',
		numberFormatter.format(pipas) + ' Kg',
		numberFormatter.format(carburacion) + ' Kg',
		numberFormatter.format(inventarioFinalSinAlm) + ' Kg',
		numberFormatter.format(inventarioFinalSensor) + ' Kg',
		numberFormatter.format(almacen) + ' Kg',
		numberFormatter2.format(porcentajeAlmacen) + ' %',
	  ];
	});
  
	const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([...headers, ...data]);
	const wb: XLSX.WorkBook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
  
	XLSX.writeFile(wb, `Reporte_Inventario_${this.selectedPlant.name}.xlsx`);
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
