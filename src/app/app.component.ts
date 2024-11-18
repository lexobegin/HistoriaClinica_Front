import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';  // Importar el servicio ApiService
import { filter } from 'rxjs/operators';  // Importar operador filter de RxJS
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, FormsModule,NzModalModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isCollapsed = false;

  constructor(private router: Router, private apiService: ApiService) {}  // Inyectar Router y ApiService

  ngOnInit(): void {
    // Registrar la navegación en la bitácora cada vez que cambie la URL
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.registrarNavegacion(event.urlAfterRedirects);
      });
  }

  // Método para registrar la navegación en la bitácora
  registrarNavegacion(url: string) {
    const accion = 'Navegación';
    const tablaAfectada = url;

    // Llamar al método registrarBitacora del servicio ApiService
    this.apiService.registrarBitacora(accion, tablaAfectada).subscribe(
      () => {
        console.log('Navegación registrada en la bitácora');
      },
      (error) => {
        console.error('Error al registrar la navegación', error);
      }
    );
  }
}