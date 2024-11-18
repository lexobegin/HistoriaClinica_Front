import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service'; // Ajusta la ruta si es necesario
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-manage-roles',
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
  templateUrl: './manage-roles.component.html',
  styleUrls: ['./manage-roles.component.css'],
  providers: [NzMessageService]
})
export class ManageRolesComponent implements OnInit {
  roles: any[] = [];
  newRoleName: string = '';
  editedRole: any = null;
  editRoleName: string = '';
   
  // Propiedades de paginación
  pageIndex: number = 1; // Página inicial
  pageSize: number = 5;  // Número de roles por página
  // Agrega estas propiedades
  isDeleteModalVisible = false;
  roleToDeleteId: number | null = null;

  constructor(private apiService: ApiService, private message: NzMessageService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.apiService.getRoles().subscribe(
      (data) => {
        this.roles = data;
      },
      (error) => {
        this.message.error('Error al cargar los roles');
      }
    );
  }

  // Crear un nuevo rol
  createRole() {
    if (this.newRoleName.trim()) {
      const newRole = { nombre: this.newRoleName };
      this.apiService.createRole(newRole).subscribe(
        () => {
          this.loadRoles();
          this.newRoleName = '';
          this.message.success('Rol creado exitosamente');
        },
        (error) => {
          this.message.error('Error al crear el rol');
        }
      );
    } else {
      this.message.warning('El nombre del rol no puede estar vacío');
    }
  }

  // Editar rol
  editRole(role: any) {
    this.editedRole = { ...role };
    this.editRoleName = role.nombre;
  }

  // Guardar cambios
  saveRole() {
    if (this.editRoleName.trim()) {
      const updatedRole = { nombre: this.editRoleName };
      this.apiService.updateRole(this.editedRole.id, updatedRole).subscribe(
        () => {
          this.loadRoles();
          this.cancelEdit();
          this.message.success('Rol actualizado exitosamente');
        },
        (error) => {
          this.message.error('Error al actualizar el rol');
        }
      );
    } else {
      this.message.warning('El nombre del rol no puede estar vacío');
    }
  }

  // Cancelar edición
  cancelEdit() {
    this.editedRole = null;
    this.editRoleName = '';
  }

  // Método para confirmar eliminación
  confirmDelete(roleId: number) {
    this.isDeleteModalVisible = true;
    this.roleToDeleteId = roleId;
  }

  // Manejar cancelación del modal
  handleCancelDelete() {
    this.isDeleteModalVisible = false;
    this.roleToDeleteId = null;
  }

  // Manejar confirmación del modal
  handleOkDelete() {
    if (this.roleToDeleteId !== null) {
      this.deleteRole(this.roleToDeleteId);
      this.isDeleteModalVisible = false;
      this.roleToDeleteId = null;
    }
  }

  // Eliminar rol
  deleteRole(roleId: number) {
    this.apiService.deleteRole(roleId).subscribe(
      () => {
        this.loadRoles();
        this.message.success('Rol eliminado exitosamente');
      },
      (error) => {
        this.message.error('Error al eliminar el rol');
      }
    );
  }
}