import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PerfilComponent } from './user/perfil/perfil.component';
import { ManageUsuariosComponent } from './administrador/manageusuarios/manageusuarios.component';
import { ManageRolesComponent } from './administrador/manage-roles/manage-roles.component';
import { ManagePermissionsComponent } from './administrador/manage-permissions/manage-permissions.component';
import { ManageEmpleadosComponent } from './personal/manage-empleados/manage-empleados.component';
import { ManageEspecialidadesComponent } from './registro/manage-especialidades/manage-especialidades.component';
import { ManageDepartamentosComponent } from './registro/manage-departamentos/manage-departamentos.component';
import { ManageServiciosComponent} from './registro/manage-servicios/manage-servicios.component'
import { ManageProgramacionMedicosComponent } from './personal/manage-programacion-medicos/manage-programacion-medicos.component';
import { ManageBitacoraComponent } from './administrador/manage-bitacora/manage-bitacora.component';
import { ManageCitasComponent } from './atenciones/manage-citas/manage-citas.component';
import { ManagePacientesComponent } from './atenciones/manage-pacientes/manage-pacientes.component';
import { TriageComponent } from './atenciones/triage/triage.component';
import { ManageHistorialClinicoComponent } from './atenciones/manage-historial-clinico/manage-historial-clinico.component';
import { VerAntecedentesComponent } from './atenciones/ver-antecedentes/ver-antecedentes.component';

import { ManageAtencionesMedicoComponent } from './atenciones/manage-atenciones-medico/manage-atenciones-medico.component';
import { ConsultaMedicaComponent } from './atenciones/consulta-medica/consulta-medica.component';
export const routes: Routes = [
  // Ruta para el HomeComponent sin navbar
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Rutas que utilizan el MainLayoutComponent (con navbar)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'perfil',
        component: PerfilComponent
      },
      { path: 'administrador/usuarios', 
        component: ManageUsuariosComponent 
      },
      { path: 'administrador/roles', 
        component: ManageRolesComponent 
      },
      { path: 'administrador/permisos', 
        component: ManagePermissionsComponent 
      },
      { path: 'personal/empleados', 
        component: ManageEmpleadosComponent 
      },
      { path: 'configuracion/medicos',
        component: ManageProgramacionMedicosComponent
      },
      { path: 'registro/especialidades', 
        component: ManageEspecialidadesComponent 
      },
      { path: 'registro/departamentos', 
        component: ManageDepartamentosComponent 
      },
      { path: 'registro/servicios',
        component: ManageServiciosComponent
      },
      { path: 'administrador/bitacora', 
        component: ManageBitacoraComponent 
      },
      {
        path: 'citas-medicas',
        component: ManageCitasComponent
      },
      {
        path: 'atenciones/paciente',
        component: ManagePacientesComponent
      },
      {
        path: 'atenciones/triaje',
        component: TriageComponent
      },
      {
        path: 'atenciones/Historial-Paciente',
        component: ManageHistorialClinicoComponent
      },
      {
        path: 'atenciones/Ver_antecedente/:userId',
        component: VerAntecedentesComponent
      },
      {
        path: 'atenciones/atencines_realizara_medico',
        component:ManageAtencionesMedicoComponent 
      },
      {
        path: 'consulta-medica/:citaId/:consultaId', component: ConsultaMedicaComponent
      },
      {
        path: 'welcome',
        loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES)
      },
      // Agrega aquí otras rutas que deben mostrar el navbar
    ]
  },

  // Manejo de rutas no encontradas
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
