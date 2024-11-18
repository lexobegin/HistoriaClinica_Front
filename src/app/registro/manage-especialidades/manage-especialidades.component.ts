import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-manage-especialidades',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule
  ],
  templateUrl: './manage-especialidades.component.html',
  styleUrls: ['./manage-especialidades.component.css']
})
export class ManageEspecialidadesComponent implements OnInit {
  especialidades: any[] = [];
  especialidadesPaginadas: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  isModalVisible = false;
  modalTitle = 'Crear Especialidad';
  editEspecialidadData: any = { nombre: '' };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEspecialidades();
  }

  loadEspecialidades() {
    this.apiService.getEspecialidades().subscribe((data) => {
      this.especialidades = data;
      this.paginateEspecialidades();
    });
  }

  openCreateModal() {
    this.modalTitle = 'Crear Especialidad';
    this.editEspecialidadData = { nombre: '' };
    this.isModalVisible = true;
  }

  openEditModal(especialidad: any) {
    this.modalTitle = 'Editar Especialidad';
    this.editEspecialidadData = { ...especialidad };
    this.isModalVisible = true;
  }

  handleOk() {
    if (this.modalTitle === 'Crear Especialidad') {
      this.createEspecialidad();
    } else {
      this.saveEspecialidad();
    }
    this.isModalVisible = false;
  }

  handleCancel() {
    this.isModalVisible = false;
  }

  createEspecialidad() {
    this.apiService.createEspecialidad(this.editEspecialidadData).subscribe(() => {
      this.loadEspecialidades();
    });
  }

  saveEspecialidad() {
    this.apiService.updateEspecialidad(this.editEspecialidadData.id, this.editEspecialidadData).subscribe(() => {
      this.loadEspecialidades();
    });
  }

  confirmDelete(id: number) {
    if (confirm('¿Estás seguro de eliminar esta especialidad?')) {
      this.deleteEspecialidad(id);
    }
  }

  deleteEspecialidad(id: number) {
    this.apiService.deleteEspecialidad(id).subscribe(() => {
      this.loadEspecialidades();
    });
  }

  paginateEspecialidades(data = this.especialidades) {
    this.totalPages = Math.ceil(data.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    this.especialidadesPaginadas = data.slice(start, start + this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateEspecialidades();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateEspecialidades();
    }
  }
}
