import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Importar módulos de NG-ZORRO
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageService } from 'ng-zorro-antd/message';

interface UserData {
  ci: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento: Date | null;
  username: string;
  password: string;
  telefono: string;
  genero: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzDatePickerModule
  ],
  providers: [NzMessageService]
})
export class RegisterComponent {
  userData: UserData = {
    ci: '',
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: null,
    username: '',
    password: '',
    telefono: '',
    genero: ''
  };

  constructor(
    private apiService: ApiService,
    private router: Router,
    private message: NzMessageService
  ) {}

  onRegister() {
    // Validación del formulario antes de enviar
    if (
      !this.userData.ci ||
      !this.userData.nombre ||
      !this.userData.apellido_paterno ||
      !this.userData.fecha_nacimiento ||
      !this.userData.username ||
      !this.userData.password ||
      !this.userData.telefono ||
      !this.userData.genero
    ) {
      this.message.error('Por favor, complete todos los campos requeridos.');
      return;
    }

    // Formatear la fecha de nacimiento
    let formattedDate = '';
    if (this.userData.fecha_nacimiento instanceof Date) {
      formattedDate = this.userData.fecha_nacimiento.toISOString().split('T')[0];
    }

    const dataToSend = { ...this.userData, fecha_nacimiento: formattedDate };

    this.apiService.register(dataToSend).subscribe(
      response => {
        this.message.success('Usuario registrado exitosamente.');
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error en el registro:', error);
        this.message.error('Error al registrar el usuario.');
      }
    );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}