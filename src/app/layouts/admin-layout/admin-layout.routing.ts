import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/supplying/icons.component';
import { MapsComponent } from '../../pages/resume/maps.component';
import { UserProfileComponent } from '../../pages/inventory/user-profile.component';
import { TablesComponent } from '../../pages/validation/tables.component';
import { AdminGuard } from 'src/app/guards/admin.guard';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { GuardAdminGuard } from 'src/app/guards/guard-admin.guard';
import { CilindrosComponent } from 'src/app/pages/cilindros/cilidros.component';
import { PipasComponent } from 'src/app/pages/pipas/pipas.component';
import { CarburacionComponent } from 'src/app/pages/carburacion/carburacion.component';
import { InventarioFinalComponent } from 'src/app/pages/inventariofinal/inventariofinal.component';

export const AdminLayoutRoutes: Routes = [
    { path: '',      component: LoginComponent },
    { path: 'resume',          component: MapsComponent,canActivate:[AdminGuard] },
    { path: 'supplying',          component: IconsComponent,canActivate:[AdminGuard,GuardAdminGuard] },
    { path: 'inventory',      component: UserProfileComponent,canActivate:[AdminGuard,GuardAdminGuard] },
    { path: 'cilindros',          component: CilindrosComponent,canActivate:[AdminGuard] },
    { path: 'pipas',          component: PipasComponent,canActivate:[AdminGuard] },
    { path: 'carburacion',          component: CarburacionComponent,canActivate:[AdminGuard] },
    { path: 'inventariofinal',          component: InventarioFinalComponent,canActivate:[AdminGuard] },
];
