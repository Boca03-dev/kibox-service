import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact implements OnInit {
  form = { name: '', email: '', phone: '', message: '' };
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private messageService: MessageService,
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

  this.loading = true;
  this.cdr.detectChanges();

  this.messageService.sendMessage(this.form).subscribe({
    next: () => {
      this.loading = false;
      this.successMessage = 'Poruka je uspešno poslata! Odgovorićemo vam uskoro.';
      this.form = { name: '', email: '', phone: '', message: '' };
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.loading = false;
      this.errorMessage = err.error?.message || 'Greška pri slanju poruke';
      this.cdr.detectChanges();
    }
  });
}
}