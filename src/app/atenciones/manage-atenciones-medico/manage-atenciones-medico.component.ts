// manage-atenciones-medico.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { ApiService } from '../../api.service';
import { Cita } from '../../models/citas.model';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalRef , NzModalModule } from 'ng-zorro-antd/modal';
import { ConsultaMedicaComponent } from '../consulta-medica/consulta-medica.component';

@Component({
  selector: 'app-manage-atenciones-medico',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzSpinModule,
    ConsultaMedicaComponent,
    NzModalModule
  ],
  templateUrl: './manage-atenciones-medico.component.html',
  styleUrls: ['./manage-atenciones-medico.component.css'],
})
export class ManageAtencionesMedicoComponent implements OnInit {
  citas: Cita[] = [];
  isLoading = false;
  medicoUserId?: number;
  

  constructor(
    private apiService: ApiService,
    private message: NzMessageService,
    private router: Router // Inyecta el enrutador
  ) {}


  ngOnInit(): void {
    this.obtenerMedicoUserId();
    this.loadCitas();
  }

  obtenerMedicoUserId() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.medicoUserId = user.id;

    if (!this.medicoUserId) {
      this.message.error('No se pudo obtener el ID del médico. Por favor, inicia sesión nuevamente.');
    }
  }

  loadCitas() {
    if (!this.medicoUserId) return;

    this.isLoading = true;
    this.apiService.getCitasByMedicoUserId(this.medicoUserId).subscribe(
      (data: Cita[]) => {
        this.citas = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar las citas del médico:', error);
        this.message.error('Error al cargar las citas.');
        this.isLoading = false;
      }
    );
  }

  abrirMenuConsulta(cita: Cita) {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const horaInicio = new Date().toLocaleTimeString('it-IT'); // Hora actual en formato HH:mm:ss

    this.apiService.crearConsulta(cita.id, user.id, horaInicio).subscribe(
        (response) => {
            const consultaId = response.id; // Almacena el id de la consulta devuelto por el backend
            this.router.navigate(['/consulta-medica', cita.id,consultaId]);
        },
        (error) => {
            console.error('Error al iniciar la consulta:', error);
            this.message.error('Error al iniciar la consulta.');
        }
    );
  }

  // abrirMenuConsulta(cita: Cita) {
  //   // Navegar al componente de consulta médica con el ID de la cita
  //   this.router.navigate(['/consulta-medica', cita.id]);
  // }

  // cerrarMenuConsulta() {
  //   this.selectedCita = null;
  // }

  
}
