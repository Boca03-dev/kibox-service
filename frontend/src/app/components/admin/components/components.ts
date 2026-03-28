import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { ComponentService } from '../../../services/component';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './components.html',
  styleUrl: './components.css'
})
export class Components implements OnInit {
  allComponents: any[] = [];
  filteredComponents: any[] = [];
  filterType = '';
  loading = false;
  successMessage = '';
  errorMessage = '';

  newComponent = {
    name: '',
    type: 'cpu',
    brand: '',
    price: 0,
    performance: 0,
    tdp: 0
  };

  constructor(
    private authService: AuthService,
    private componentService: ComponentService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    this.loadComponents();
  }

  loadComponents(): void {
    this.componentService.getComponents().subscribe({
      next: (data) => {
        this.allComponents = data;
        this.filteredComponents = data;
        this.cdr.detectChanges();
      }
    });
  }

  filterComponents(): void {
    if (!this.filterType) {
      this.filteredComponents = this.allComponents;
    } else {
      this.filteredComponents = this.allComponents.filter(c => c.type === this.filterType);
    }
  }

  addComponent(): void {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.componentService.createComponent(this.newComponent).subscribe({
      next: (data) => {
        this.loading = false;
        this.successMessage = 'Komponenta uspešno dodata!';
        this.allComponents.push(data);
        this.filterComponents();
        this.newComponent = { name: '', type: 'cpu', brand: '', price: 0, performance: 0, tdp: 0 };
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Greška pri dodavanju';
        this.cdr.detectChanges();
      }
    });
  }

  deleteComponent(id: string): void {
    if (!confirm('Da li ste sigurni?')) return;
    this.componentService.deleteComponent(id).subscribe({
      next: () => {
        this.allComponents = this.allComponents.filter(c => c._id !== id);
        this.filterComponents();
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