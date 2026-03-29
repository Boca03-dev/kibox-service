import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { MessageService } from '../../../services/message';
import { AppointmentService } from '../../../services/appointment';
import { ConfigurationService } from '../../../services/configuration';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AdminSidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  loading = true;
  unreadMessages = 0;
  pendingAppointments = 0;
  totalConfigurations = 0;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private appointmentService: AppointmentService,
    private configService: ConfigurationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }

    this.messageService.getMessages().subscribe({
      next: (data) => {
        this.unreadMessages = data.filter((m: any) => !m.read).length;
        this.cdr.detectChanges();
      }
    });

    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.pendingAppointments = data.filter((a: any) => a.status === 'pending').length;
        this.cdr.detectChanges();
      }
    });

    this.configService.getAllConfigurations().subscribe({
      next: (data) => {
        this.totalConfigurations = data.length;
        this.loading = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.cdr.detectChanges();
  }
}