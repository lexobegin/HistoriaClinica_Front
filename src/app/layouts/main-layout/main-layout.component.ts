import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

// Importar módulos de NG-ZORRO
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzAvatarModule,
    NzPopoverModule,
    NzButtonModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  isCollapsed = false;
  userName = 'Usuario';
  userRole: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.userName = user.nombre || 'Usuario';
    this.userRole = user.role || null; // Asignamos el rol del usuario
  }

  // Métodos para verificar si el usuario tiene acceso a ciertas secciones
  isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  isMedico(): boolean {
    return this.userRole === 'MEDICO';
  }

  isEspecialista(): boolean {
    return this.userRole === 'ESPECIALISTA';
  }

  isSecretario(): boolean {
    return this.userRole === 'SECRETARIO';
  }

  isEnfermero(): boolean {
    return this.userRole === 'ENFERMERO';
  }

  goToProfile(): void {
    this.router.navigate(['/perfil']);
  }

  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}