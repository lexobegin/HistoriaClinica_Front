import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-triage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule
  ],
  templateUrl: './triage.component.html',
  styleUrls: ['./triage.component.css']
})
export class TriageComponent implements OnInit {
  triajes: any[] = [];
  triajesPaginados: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  isModalVisible = false;
  modalTitle = 'Registrar Triaje';
  newTriageData: any = {
    fecha: '',
    temperatura: null,
    presionArterial: '',
    frecuenciaCardiaca: null,
    frecuenciaRespiratoria: null,
    saturacionOxigeno: null,
    peso: null,
    altura: null,
    sintomas: '',
    estadoMental: '',
    user: { id: null } // ID del paciente
  };
  pacientes: any[] = []; // Lista de pacientes para seleccionar en el modal

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTriajes();
    this.loadPacientes();
  }

  loadTriajes() {
    this.apiService.getTriageList().subscribe((data) => {
      this.triajes = data;
      this.paginateTriajes();
    });
  }

  loadPacientes() {
    this.apiService.getUsuarios().subscribe((data) => {
      this.pacientes = data;
    });
  }

  openRegisterModal() {
    this.modalTitle = 'Registrar Triaje';
    this.newTriageData = {
      fecha: '',
      temperatura: null,
      presionArterial: '',
      frecuenciaCardiaca: null,
      frecuenciaRespiratoria: null,
      saturacionOxigeno: null,
      peso: null,
      altura: null,
      sintomas: '',
      estadoMental: '',
      user: { id: null }
    };
    this.isModalVisible = true;
  }

  handleOk() {
    this.registerTriage();
    this.isModalVisible = false;
  }

  handleCancel() {
    this.isModalVisible = false;
  }

  registerTriage() {
    this.apiService.registerTriage(this.newTriageData).subscribe(() => {
      this.loadTriajes();
    });
  }

  paginateTriajes(data = this.triajes) {
    this.totalPages = Math.ceil(data.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    this.triajesPaginados = data.slice(start, start + this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateTriajes();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateTriajes();
    }
  }
}