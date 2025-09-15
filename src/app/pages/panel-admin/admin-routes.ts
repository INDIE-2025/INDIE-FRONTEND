import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../layout/admin-layout/admin-layout.component';
import { AdminUsuariosPage } from './usuarios/admin-usuarios.component';
import { AdminTiposUsuarioPage } from './tipos-usuario/admin-tipos-usuario.component';
import { AdminComentariosPage } from './comentarios/admin-comentarios.component';
import { ConfigParametrosPage } from './config-parametros/config-parametros.component';
import { BackupRecuperacionPage } from './backup-recuperacion/backup-recuperacion.component';
import { ReportesPage } from './reportes/reportes.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'usuarios', component: AdminUsuariosPage },
      { path: 'tipos-usuario', component: AdminTiposUsuarioPage },
      { path: 'comentarios', component: AdminComentariosPage },
      { path: 'configuracion', component: ConfigParametrosPage },
      { path: 'backup-recuperacion', component: BackupRecuperacionPage },
      { path: 'reportes', component: ReportesPage },
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
    ]
  }
];