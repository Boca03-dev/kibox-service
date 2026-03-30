import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { ConfigurationService } from '../../../services/configuration';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, DatePipe, AdminSidebar],
  templateUrl: './configurations.html',
  styleUrl: './configurations.css'
})
export class Configurations implements OnInit {
  configurations: any[] = [];
  loading = true;

  componentTypes = [
    { key: 'cpu', label: 'CPU' },
    { key: 'gpu', label: 'GPU' },
    { key: 'ram', label: 'RAM' },
    { key: 'storage', label: 'Storage' },
    { key: 'motherboard', label: 'Matična' },
    { key: 'psu', label: 'Napajanje' },
    { key: 'case', label: 'Kućište' }
  ];

  constructor(
    private authService: AuthService,
    private configService: ConfigurationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }

    this.configService.getAllConfigurations().subscribe({
      next: (data) => {
        this.configurations = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getComponentName(config: any, type: string): string {
    return config.components?.[type]?.name || '—';
  }

  getComponentIcon(type: string): string {
    const icons: any = {
      cpu: 'fa-solid fa-microchip',
      gpu: 'fa-solid fa-hard-drive',
      ram: 'fa-solid fa-memory',
      storage: 'fa-solid fa-database',
      motherboard: 'fa-solid fa-circle-nodes',
      psu: 'fa-solid fa-plug',
      case: 'fa-solid fa-box'
    };
    return icons[type] || 'fa-solid fa-gear';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}