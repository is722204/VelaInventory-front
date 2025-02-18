import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http:HttpClient) { }
  // url="http://localhost:3000"
  // url="https://vela.s4iot.com"
  url=""

  login(email:string,psw:string){
    let url=this.url+"/login";
    return this.http.post(url,{email,psw})
  }
  getProjects(token:String){
    let url=this.url+"/versions/projects";
    return this.http.post(url,{token})
  }
  getVersions(token:String, project:String){
    let url=this.url+"/versions/project-versions";
    return this.http.post(url,{token,project})
  }

  addProject(token:String, projectName:String,version:String,features:String){
    let url=this.url+"/versions/add-project";
    return this.http.post(url,{token,projectName,version,features,prod:"yes"})
  }
  addVersion(token:String, projectName:String,version:String,features:String,prod:String){
    let url=this.url+"/versions/add-version";
    return this.http.post(url,{token,projectName,version,features,prod})
  }

  //FOTAS
  getFotaDetails(token:String){
    let url=this.url+"/fota/details";
    return this.http.post(url,{token})
  }
  requestFota(token:String,version:String,devices:any,razon:any){
    let url=this.url+"/fota/petition";
    return this.http.post(url,{token,version,devices,razon})
  }

  deleteFota(token:String,status:String,key:String){
    let url=this.url+"/fota/fota-delete";
    return this.http.post(url,{token,status,key})
  }


  //VALIDATION
  getTramas(token:String,IMEI:number,limit:any){
    let url=this.url+"/validation/tramas";
    return this.http.post(url,{token,IMEI,limit})
  }
  getPAP(token:String,IMEI:number){
    let url=this.url+"/validation/getpap";
    return this.http.post(url,{token,IMEI})
  }
  getImei(token:String,qr:number){
    let url=this.url+"/validation/getimei";
    return this.http.post(url,{token,qr})
  }
  changeParams(token:String,imei:number,pap:Object){
    let url=this.url+"/validation/changeparams";
    return this.http.post(url,{token,imei,pap})
  }
  getLocation(cid:number){
    const url="https://precios.cuantogas.com/cid"
    return this.http.post(url,{cid})
  }

  reSendPayload(payload:number){
    const url=this.url+"/validation/sendPayload"
    return this.http.post(url,{payload,token:localStorage.getItem("token")})
  }






  //VELA PEGASUS
  getPlants(){
    const url=this.url+"/plants"
    return this.http.post(url,{token:localStorage.getItem("token")})
  }
  getTanks(id_plant){
    const url=this.url+"/plants/tanks"
    return this.http.post(url,{id_plant,token:localStorage.getItem("token")})
  }
  getPGS(){
    const url=this.url+"/supplying/getpg"
    return this.http.post(url,{token:localStorage.getItem("token")})
  }
  getSupplyByPlant(id_plant,year,month,day){
    const url=this.url+"/supplying"
    return this.http.post(`${url}`,{id_plant,year,month,day,token:localStorage.getItem("token")})
  }
  getCilindrosByPlant(id_plant,year,month,day){
    const url=this.url+"/cilindros"
    return this.http.post(`${url}`,{id_plant,year,month,day,token:localStorage.getItem("token")})
  }
  getCarburationByPlant(id_plant,year,month,day){
    const url=this.url+"/carburation"
    return this.http.post(`${url}`,{id_plant,year,month,day,token:localStorage.getItem("token")})
  }
  getPipasByPlant(id_plant,year,month,day){
    const url=this.url+"/pipas"
    return this.http.post(`${url}`,{id_plant,year,month,day,token:localStorage.getItem("token")})
  }
  getStorageByPlant(id_plant,year,month,day){
    const url=this.url+"/storage"
    return this.http.post(`${url}`,{id_plant,year,month,day,token:localStorage.getItem("token")})
  }
  deleteSupplyByPlant(id_plant,id_supply){
    const url=this.url+"/supplying/delete-supply"
    return this.http.post(`${url}`,{id_plant,id:id_supply,token:localStorage.getItem("token")})
  }
  addSupplyByPlant(
    id_plant,
    year,
    month,
    day,
    folio,
    transport,
    kgCartaPorte,
    kgRI
  ) {
    const url = this.url + "/supplying/add-supply"
    return this.http.post(`${url}`, {
      id_plant, year, month, day, folio,
      transport,
      kgCartaPorte,
      kgRI, token: localStorage.getItem("token")
    })
  }

  getDashboard(id_plant,date1,date2){
    const url=this.url+"/dashboard"
    return this.http.post(`${url}`,{id_plant, date1,date2,token:localStorage.getItem("token")})

  }



  getChartByImei(imei,init,end){
    const url= this.url+"/chart"
    return this.http.post(`${url}`,{imei,init,end:end+(3600000*6)})
  }


  //REPORTES
  getCilindrosPegasus(planta,fecha){
    return this.http.post(`${this.url}/cilindrosreporte`,{planta,fecha},{ responseType: 'text' })
  }
  getPipasCarburacionPegasus(planta,fecha){
    return this.http.get(`https://api-pegasus.s4iot.com/exportarReporteCarga/${planta}/${fecha}`)
  }
  getDescargasPegasus(planta,fecha){
    return this.http.get(`https://api-pegasus.s4iot.com/exportarDescargas/${planta}/${fecha}`)
  }


}
