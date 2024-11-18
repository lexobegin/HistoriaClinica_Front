import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-manage-departamentos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule
  ],
  templateUrl: './manage-departamentos.component.html',
  styleUrls: ['./manage-departamentos.component.css'],
  providers: [NzMessageService]
})
export class ManageDepartamentosComponent implements OnInit {
  departamentos: any[] = [];
  newDepartamento: any = { nombre: '', direccion: '' };
  editedDepartamento: any = null;
  editDepartamentoData: any = { nombre: '', direccion: '' };
  isDeleteModalVisible = false;
  departamentoToDeleteId: number | null = null;

  constructor(private apiService: ApiService, private message: NzMessageService) {}

  ngOnInit(): void {
    this.loadDepartamentos();
  }

  loadDepartamentos() {
    this.apiService.getDepartamentos().subscribe(
      (data) => {
        this.departamentos = data;
      },
      () => {
        this.message.error('Error al cargar los departamentos');
      }
    );
  }

  createDepartamento() {
    if (this.newDepartamento.nombre.trim() && this.newDepartamento.direccion.trim()) {
      this.apiService.createDepartamento(this.newDepartamento).subscribe(
        () => {
          this.loadDepartamentos();
          this.newDepartamento = { nombre: '', direccion: '' };
          this.message.success('Departamento creado exitosamente');
        },
        () => {
          this.message.error('Error al crear el departamento');
        }
      );
    } else {
      this.message.warning('Los campos no pueden estar vacíos');
    }
  }

  editDepartamento(departamento: any) {
    this.editedDepartamento = { ...departamento };
    this.editDepartamentoData = { nombre: departamento.nombre, direccion: departamento.direccion };
  }

  saveDepartamento() {
    if (this.editDepartamentoData.nombre.trim() && this.editDepartamentoData.direccion.trim()) {
      this.apiService.updateDepartamento(this.editedDepartamento.id, this.editDepartamentoData).subscribe(
        () => {
          this.loadDepartamentos();
          this.cancelEdit();
          this.message.success('Departamento actualizado exitosamente');
        },
        () => {
          this.message.error('Error al actualizar el departamento');
        }
      );
    } else {
      this.message.warning('Los campos no pueden estar vacíos');
    }
  }

  cancelEdit() {
    this.editedDepartamento = null;
    this.editDepartamentoData = { nombre: '', direccion: '' };
  }

  confirmDelete(departamentoId: number) {
    this.isDeleteModalVisible = true;
    this.departamentoToDeleteId = departamentoId;
  }

  handleCancelDelete() {
    this.isDeleteModalVisible = false;
    this.departamentoToDeleteId = null;
  }

  handleOkDelete() {
    if (this.departamentoToDeleteId !== null) {
      this.deleteDepartamento(this.departamentoToDeleteId);
      this.isDeleteModalVisible = false;
      this.departamentoToDeleteId = null;
    }
  }

  deleteDepartamento(id: number) {
    this.apiService.deleteDepartamento(id).subscribe(
      () => {
        this.loadDepartamentos();
        this.message.success('Departamento eliminado exitosamente');
      },
      () => {
        this.message.error('Error al eliminar el departamento');
      }
    );
  }
}
