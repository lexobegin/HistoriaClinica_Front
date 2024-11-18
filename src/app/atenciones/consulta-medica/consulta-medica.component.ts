import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Cita } from '../../models/citas.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { VerAntecedentesComponent } from '../ver-antecedentes/ver-antecedentes.component';
import { AnadirDiagnosticoComponent } from '../anadir-diagnostico/anadir-diagnostico.component';
import { RecetarMedicamentosComponent } from '../recetar-medicamentos/recetar-medicamentos.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consulta-medica',
  standalone: true,
  imports: [
    CommonModule,
    NzTabsModule,
    FormsModule,
    VerAntecedentesComponent,
    AnadirDiagnosticoComponent,
    RecetarMedicamentosComponent,
  ],
  templateUrl: './consulta-medica.component.html',
  styleUrl: './consulta-medica.component.css',
})
export class ConsultaMedicaComponent implements OnInit {
  citaId!: number;
  cita!: Cita;
  isLoading = false;
  consultaId!: number;
  motivoConsulta: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la cita desde los parámetros de la ruta

    this.citaId = Number(this.route.snapshot.paramMap.get('citaId'));
    if (isNaN(this.citaId)) {
      this.message.error('ID de cita inválido.');
      this.router.navigate(['/atenciones-medico']);
      return;
    }

    this.consultaId = Number(this.route.snapshot.paramMap.get('consultaId'));
    if (isNaN(this.consultaId)) {
      this.message.error('ID de consulta inválido.');
      this.router.navigate(['/atenciones-medico']);
      return;
    }
    this.loadCita();
  }

  loadCita() {
    this.isLoading = true;
    this.apiService.getCitaById(this.citaId).subscribe(
      (data: Cita) => {
        this.cita = data; // Ahora asignamos directamente el objeto de tipo Cita
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar la cita:', error);
        this.message.error('Error al cargar la cita.');
        this.isLoading = false;
        this.router.navigate(['/atenciones-medico']);
      }
    );
  }

  finalizarConsulta() {
    const horaFin = new Date().toLocaleTimeString('it-IT'); // Hora actual en formato HH:mm:ss

    // Llamar al método `finalizarConsulta` en ApiService con `motivoConsulta`
    this.apiService.finalizarConsulta(this.consultaId, this.motivoConsulta, horaFin).subscribe(
        () => {
            this.message.success('Consulta finalizada.');
            this.router.navigate(['atenciones/atencines_realizara_medico']);
        },
        (error) => {
            console.error('Error al finalizar la consulta:', error);
            this.message.error('Error al finalizar la consulta.');
        }
    );
}

  verHistorial() {
    // Lógica para ver el historial del paciente
    this.message.info('Mostrando el historial del paciente...');
  }

  anadirDiagnostico() {
    // Lógica para añadir diagnóstico
    this.message.info('Añadiendo diagnóstico...');
  }

  recetarMedicamentos() {
    // Lógica para recetar medicamentos
    this.message.info('Recetando medicamentos...');
  }

  // cerrar() {
  //   this.cerrarConsulta.emit(); // Emitir evento para cerrar la consulta
  // }
}
