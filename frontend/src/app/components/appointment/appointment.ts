import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css'
})
export class Appointment implements OnInit {
  form = { name: '', email: '', phone: '', date: '', description: '' };
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.form.name = user.name || '';
        this.form.email = user.email || '';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.phone && !/^(\+\d{9,15}|06\d{7,8})$/.test(this.form.phone)) {
      this.errorMessage = 'Telefon mora počinjati sa + ili 06 i sadržati samo brojeve';
      this.cdr.detectChanges();
      return;
    }

    if (!this.form.date) {
      this.errorMessage = 'Datum i vreme su obavezni!';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.appointmentService.createAppointment(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Termin je uspešno zakazan! Kontaktiraćemo vas uskoro.';
        this.form = { name: '', email: '', phone: '', date: '', description: '' };
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Greška pri zakazivanju termina';
        this.cdr.detectChanges();
      }
    });
  }
}