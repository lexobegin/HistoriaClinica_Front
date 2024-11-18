import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonModule } from '@angular/common';

// Importar módulos de NG-ZORRO
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-manage-permissions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzCheckboxModule,
    NzButtonModule,
    NzFormModule,
    NzNotificationModule
  ],
  templateUrl: './manage-permissions.component.html',
  styleUrls: ['./manage-permissions.component.css']
})
export class ManagePermissionsComponent implements OnInit {
  roles: any[] = [];
  permissions: any[] = [];
  selectedRoleId: number | null = null;
  rolePermissions: number[] = [];
  form: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {
    this.form = this.fb.group({
      selectedRole: [null],
      permissions: [[]]
    });
  }

  ngOnInit(): void {
    this.loadRolesAndPermissions();
  }

  loadRolesAndPermissions(): void {
    // Cargar roles
    this.apiService.getRoles().subscribe(
      (data) => {
        this.roles = data;
      },
      (error) => {
        this.notification.error('Error', 'No se pudieron cargar los roles');
      }
    );

    // Cargar permisos
    this.apiService.getPermissions().subscribe(
      (data) => {
        this.permissions = data;
      },
      (error) => {
        this.notification.error('Error', 'No se pudieron cargar los permisos');
      }
    );
  }

  onRoleChange(roleId: number): void {
    if (roleId) {
      this.selectedRoleId = roleId;
      this.apiService.getRolePermissions(roleId).subscribe(
        (data) => {
          // Asumiendo que data.permisos es un array de permisos
          if (data && data.permisos) {
            this.rolePermissions = data.permisos.map((p: any) => p.id);
          } else {
            this.rolePermissions = [];
          }
        },
        (error) => {
          this.notification.error('Error', 'No se pudieron cargar los permisos del rol seleccionado');
        }
      );
    } else {
      this.selectedRoleId = null;
      this.rolePermissions = [];
    }
  }

  // Añadimos el método togglePermission
  togglePermission(permissionId: number, checked: boolean): void {
    if (checked) {
      if (!this.rolePermissions.includes(permissionId)) {
        this.rolePermissions.push(permissionId);
      }
    } else {
      this.rolePermissions = this.rolePermissions.filter(id => id !== permissionId);
    }
  }

  savePermissions(): void {
    if (!this.selectedRoleId) {
      this.notification.error('Error', 'Por favor, selecciona un rol.');
      return;
    }

    const selectedRole = this.roles.find(role => role.id === Number(this.selectedRoleId));

    if (!selectedRole) {
      this.notification.error('Error', 'No se pudo encontrar el rol seleccionado.');
      return;
    }

    const payload = {
      nombre: selectedRole.nombre,
      permisos: this.rolePermissions.map(id => ({ id }))
    };

    this.apiService.updateRolePermissions(this.selectedRoleId, payload).subscribe(
      () => {
        this.notification.success('Éxito', 'Permisos actualizados correctamente');
      },
      (error) => {
        console.error('Error en la actualización de permisos:', error);
        this.notification.error('Error', 'No se pudieron actualizar los permisos');
      }
    );
  }
}