import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/supplying/icons.component';
import { MapsComponent } from '../../pages/resume/maps.component';
import { UserProfileComponent } from '../../pages/inventory/user-profile.component';
import { TablesComponent } from '../../pages/validation/tables.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { CilindrosComponent } from 'src/app/pages/cilindros/cilidros.component';
import { PipasComponent } from 'src/app/pages/pipas/pipas.component';
import { CarburacionComponent } from 'src/app/pages/carburacion/carburacion.component';
import { InventarioFinalComponent } from 'src/app/pages/inventariofinal/inventariofinal.component';
// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    CanvasJSAngularChartsModule,
    NgbDatepickerModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    CilindrosComponent,
    PipasComponent,
    CarburacionComponent,
    InventarioFinalComponent
  ]
})

export class AdminLayoutModule {}
