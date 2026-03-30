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
import { Components } from './components/admin/components/components';
import { Games } from './components/admin/games/games';
import { Configurations } from './components/admin/configurations/configurations';
import { MyAppointments } from './components/my-appointments/my-appointments';
import { Notifications } from './components/notifications/notifications';
import { Chat } from './components/chat/chat';
import { AdminChat } from './components/admin/chat/chat';

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
  { path: 'admin/components', component: Components, canActivate: [adminGuard] },
  { path: 'admin/games', component: Games, canActivate: [adminGuard] },
  { path: 'admin/configurations', component: Configurations, canActivate: [adminGuard] },
  { path: 'my-appointments', component: MyAppointments, canActivate: [authGuard] },
  { path: 'notifications', component: Notifications, canActivate: [authGuard] },
  { path: 'chat', component: Chat, canActivate: [authGuard] },
  { path: 'admin/chat', component: AdminChat, canActivate: [adminGuard] },
  { path: 'admin/chat/:id', component: AdminChat, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];