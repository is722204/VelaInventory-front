import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export let ROUTES: RouteInfo[] = [
    { path: '/resume', title: 'Dashboard',  icon: 'ni ni-chart-pie-35', class: '' },
    { path: '/inventory', title: 'Niveles Sensor',  icon:'ni ni-archive-2', class: '' },
    { path: '/supplying', title: 'Descargas',  icon:'ni ni-app', class: '' },
    { path: '/cilindros', title: 'Cilindros',  icon:'ni ni-shop', class: '' },
    { path: '/pipas', title: 'Pipas',  icon:'ni ni-bus-front-12', class: '' },
    { path: '/carburacion', title: 'Carburación',  icon:'ni ni-delivery-fast', class: '' },
    // { path: '/inventariofinal', title: 'Inventario final',  icon:'ni ni-folder-17', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    if(!parseInt(localStorage.getItem("rol"))){
      this.menuItems = ROUTES.filter(menuItem => menuItem);
    }else{
      this.menuItems=[{ path: '/supplying', title: 'Descargas',  icon:'ni ni-app', class: '' }]
    }
    
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }

  logout(){
    localStorage.clear()
    window.location.reload()
  }
}
