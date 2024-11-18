import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Importa los módulos de NG-ZORRO
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzGridModule
  ],
  providers: [NzMessageService]
})
export class LoginComponent {
  loginData = {
    username: '',
    password: '',
    isWebAccess: "true"
  };

  constructor(
    private apiService: ApiService,
    private router: Router,
    private message: NzMessageService
  ) {}

  onLogin() {
    this.apiService.login(this.loginData).subscribe(
      response => {
        sessionStorage.setItem('token', response.token);
        this.apiService.getUserByUsername(this.loginData.username).subscribe(
          userDetails => {
            sessionStorage.setItem('user', JSON.stringify(userDetails));
            this.message.success('Inicio de sesión exitoso. ¡Bienvenido!');
            this.router.navigate(['/welcome']);
          },
          error => {
            console.error('Error al obtener datos del usuario:', error);
            this.message.error('Error al obtener datos del usuario');
          }
        );
      },
      error => {
        console.error('Error en el login:', error);
        this.message.error('Credenciales incorrectas');
      }
    );
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}

