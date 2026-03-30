import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { AppointmentService } from '../../../services/appointment';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, DatePipe, AdminSidebar],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})
export class Appointments implements OnInit {
  appointments: any[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }

    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      pending: 'Na čekanju',
      confirmed: 'Potvrđen',
      cancelled: 'Otkazan'
    };
    return labels[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: any = {
      pending: 'fa-solid fa-clock-rotate-left',
      confirmed: 'fa-solid fa-circle-check',
      cancelled: 'fa-solid fa-circle-xmark'
    };
    return icons[status] || 'fa-solid fa-question';
  }

  updateStatus(appointment: any, status: string): void {
    this.appointmentService.updateStatus(appointment._id, status).subscribe({
      next: () => {
        appointment.status = status;
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