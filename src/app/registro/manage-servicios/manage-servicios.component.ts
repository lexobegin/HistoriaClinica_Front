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
  selector: 'app-manage-servicios',
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
  templateUrl: './manage-servicios.component.html',
  styleUrls: ['./manage-servicios.component.css']
})
export class ManageServiciosComponent implements OnInit {
  servicios: any[] = [];
  serviciosPaginados: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  isModalVisible = false;
  modalTitle = 'Crear Servicio';
  editServicioData: any = { nombre: '', precio: null, descripcion: '', departamento: { id: null }, especialidad: { id: null } };
  departamentos: any[] = [];
  especialidades: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadServicios();
    this.loadDepartamentos();
    this.loadEspecialidades();
  }

  loadServicios() {
    this.apiService.getServicios().subscribe((data) => {
      this.servicios = data;
      this.paginateServicios();
    });
  }

  loadDepartamentos() {
    this.apiService.getDepartamentos().subscribe((data) => {
      this.departamentos = data;
    });
  }

  loadEspecialidades() {
    this.apiService.getEspecialidades().subscribe((data) => {
      this.especialidades = data;
    });
  }

  openCreateModal() {
    this.modalTitle = 'Crear Servicio';
    this.editServicioData = { nombre: '', precio: null, descripcion: '', departamento: { id: null }, especialidad: { id: null } };
    this.isModalVisible = true;
  }

  openEditModal(servicio: any) {
    this.modalTitle = 'Editar Servicio';
    this.editServicioData = { ...servicio };
    this.isModalVisible = true;
  }

  handleOk() {
    if (this.modalTitle === 'Crear Servicio') {
      this.createServicio();
    } else {
      this.saveServicio();
    }
    this.isModalVisible = false;
  }

  handleCancel() {
    this.isModalVisible = false;
  }

  createServicio() {
    this.apiService.createServicio(this.editServicioData).subscribe(() => {
      this.loadServicios();
    });
  }

  saveServicio() {
    this.apiService.updateServicio(this.editServicioData.id, this.editServicioData).subscribe(() => {
      this.loadServicios();
    });
  }

  confirmDelete(id: number) {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      this.deleteServicio(id);
    }
  }

  deleteServicio(id: number) {
    this.apiService.deleteServicio(id).subscribe(() => {
      this.loadServicios();
    });
  }

  paginateServicios(data = this.servicios) {
    this.totalPages = Math.ceil(data.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    this.serviciosPaginados = data.slice(start, start + this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateServicios();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateServicios();
    }
  }
}
