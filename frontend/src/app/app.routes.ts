import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Contact } from './components/contact/contact';
import { Appointment } from './components/appointment/appointment';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Configurator } from './components/configurator/configurator';
import { MyConfigurations } from './components/my-configurations/my-configurations';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { Messages } from './components/admin/messages/messages';
import { Appointments } from './components/admin/appointments/appointments';
import { authGuard, adminGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'contact', component: Contact },
  { path: 'appointment', component: Appointment },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'configurator', component: Configurator },
  { path: 'my-configurations', component: MyConfigurations, canActivate: [authGuard] },
  { path: 'admin', component: Dashboard, canActivate: [adminGuard] },
  { path: 'admin/messages', component: Messages, canActivate: [adminGuard] },
  { path: 'admin/appointments', component: Appointments, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];