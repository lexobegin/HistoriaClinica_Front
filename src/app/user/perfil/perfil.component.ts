import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importar módulos de NG-ZORRO
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzAvatarModule, NzDescriptionsModule, NzButtonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  id?: number;
  ci?: string;
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  fecha_nacimiento?: string;
  username?: string;
  telefono?: string;
  role?: string;

  ngOnInit() {
    // Recuperar los datos del usuario directamente de Session Storage
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.id = user.id;
    this.ci = user.ci;
    this.nombre = user.nombre;
    this.apellido_paterno = user.apellido_paterno;
    this.apellido_materno = user.apellido_materno;
    this.fecha_nacimiento = user.fecha_nacimiento;
    this.username = user.username;
    this.telefono = user.telefono;
    this.role = user.role;
  }
}
