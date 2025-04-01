import { Component, OnInit, OnDestroy } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  email=""
  password:""
  showPass: boolean = false
  message:string = ""
  constructor(private apiservice:ApiService,private router:Router) {}

  ngOnInit() {
  }
  ngOnDestroy() {
  }
  onSignIn(){
    this.apiservice.login(this.email,this.password).subscribe(
      (res:any)=>{
        console.log(res)
        localStorage.setItem("token",res.token)
        localStorage.setItem("userName",res.name)
        localStorage.setItem("rol",res.rol)
        this.router.navigate(["/resume"])
      },err=>{

        console.log("error",err)
        this.message = err.error.error
      }
  )
  }

}
