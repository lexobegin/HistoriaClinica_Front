import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

// Importar módulos de NG-ZORRO
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-manage-empleados',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzPaginationModule,
    NzButtonModule,
    NzModalModule,
    NzInputModule,
    NzFormModule,
    NzIconModule,
    NzSelectModule,
    NzDatePickerModule,
    NzSpinModule,
  ],
  providers: [NzMessageService],
  templateUrl: './manage-empleados.component.html',
  styleUrls: ['./manage-empleados.component.css'],
})
export class ManageEmpleadosComponent implements OnInit {
  empleados: any[] = [];
  empleadosPaginados: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  editedEmpleado: any = null;
  isModalOpen = false;
  isEditing = false;
  especialidades: any[] = [];
  roles: any[] = [];
  isLoading: boolean = false;
  isLoadingEmpleados=false;
  editEmpleadoData: any = {
    estado: '',
    fechaContratacion: null,
    user: {
      id: '',
      ci: '',
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      telefono: '',
      email: '',
    },
    especialidades: [],
    rolId: null, // Nuevo campo para el rol
  };

  constructor(
    private apiService: ApiService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadEmpleados();
    this.loadEspecialidades();
    this.loadRoles();
  }

  loadRoles() {
    this.apiService.getRoles().subscribe((data) => {
      this.roles = data;
    });
  }

  loadEmpleados() {
    this.isLoadingEmpleados = true; // Inicia el indicador de carga
    this.apiService.getEmpleados().subscribe(
      (data) => {
        this.empleados = data;
        this.totalItems = data.length;
        this.paginateEmpleados();
        this.isLoadingEmpleados = false; // Detiene el indicador de carga
      },
      (error) => {
        this.message.error('Error al cargar los empleados');
        console.error(error);
        this.isLoadingEmpleados = false; // Detiene el indicador de carga
      }
    );
  }
  
  loadEspecialidades() {
    this.apiService.getEspecialidades().subscribe((data) => {
      this.especialidades = data;
    });
  }

  filterEmpleados() {
    const filtered = this.empleados.filter((empleado) =>
      empleado.user.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalItems = filtered.length;
    this.currentPage = 1;
    this.paginateEmpleados(filtered);
  }

  paginateEmpleados(data = this.empleados) {
    const start = (this.currentPage - 1) * this.pageSize;
    this.empleadosPaginados = data.slice(start, start + this.pageSize);
  }

  onPageChange(pageIndex: number) {
    this.currentPage = pageIndex;
    this.paginateEmpleados();
  }

  openModal(isEditing = false, empleado: any = null) {
    this.isModalOpen = true;
    this.isEditing = isEditing;
    if (isEditing && empleado) {
      this.editedEmpleado = empleado;
      this.editEmpleadoData.estado = empleado.estado;
      this.editEmpleadoData.fechaContratacion = empleado.fechaContratacion
        ? new Date(empleado.fechaContratacion)
        : null;
      this.editEmpleadoData.user = {
        id: empleado.user.id, // Asegúrate de obtener el ID del usuario
        ci: empleado.user.ci,
        nombre: empleado.user.nombre,
        apellido_paterno: empleado.user.apellido_paterno,
        apellido_materno: empleado.user.apellido_materno,
        telefono: empleado.user.telefono,
        email: empleado.user.username,
        fecha_nacimiento: empleado.user.fecha_nacimiento
          ? new Date(empleado.user.fecha_nacimiento)
          : null,
        genero: empleado.user.genero,
      };
      this.editEmpleadoData.especialidades = empleado.especialidades.map(
        (e: any) => e.id
      );
      this.editEmpleadoData.rolId = empleado.user.rol?.id; // Preselecciona el rol actual
    } else {
      this.resetForm();
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  createEmpleado() {
    this.isLoading = true; // Inicia el indicador de carga
    const empleadoData = {
      fechaContratacion: this.formatDate(
        this.editEmpleadoData.fechaContratacion
      ),
      estado: this.editEmpleadoData.estado,
      especialidades: this.editEmpleadoData.especialidades.map(
        (id: number) => ({ id })
      ),
    };

    this.apiService
      .createEmpleado(
        empleadoData,
        this.editEmpleadoData.user.id,
        this.editEmpleadoData.rolId
      )
      .subscribe(
        () => {
          this.loadEmpleados();
          this.closeModal();
          this.message.success('Empleado creado exitosamente'); // Muestra mensaje de éxito
          this.isLoading = false; // Detiene el indicador de carga
        },
        (error) => {
          this.message.error('Error al crear el empleado'); // Muestra mensaje de error
          console.error(error);
          this.isLoading = false; // Detiene el indicador de carga
        }
      );
  }

  saveEmpleado() {
    if (this.editedEmpleado) {
      this.isLoading = true; // Inicia el indicador de carga
      const empleadoData = {
        estado: this.editEmpleadoData.estado,
        fechaContratacion: this.formatDate(
          this.editEmpleadoData.fechaContratacion
        ),
        user: {
          id: this.editEmpleadoData.user.id,
          nombre: this.editEmpleadoData.user.nombre,
          apellidoPaterno: this.editEmpleadoData.user.apellido_paterno,
          apellidoMaterno: this.editEmpleadoData.user.apellido_materno,
          telefono: this.editEmpleadoData.user.telefono,
          fechaNacimiento: this.formatDate(
            this.editEmpleadoData.user.fecha_nacimiento
          ),
          genero: this.editEmpleadoData.user.genero,
          ci: this.editEmpleadoData.user.ci,
        },
        especialidades: this.editEmpleadoData.especialidades.map(
          (id: number) => ({ id })
        ),
      };

      this.apiService
        .updateEmpleado(
          this.editedEmpleado.id,
          empleadoData,
          this.editEmpleadoData.rolId
        )
        .subscribe(
          () => {
            this.loadEmpleados();
            this.closeModal();
            this.message.success('Empleado actualizado exitosamente'); // Muestra mensaje de éxito
            this.isLoading = false; // Detiene el indicador de carga
          },
          (error) => {
            this.message.error('Error al actualizar el empleado'); // Muestra mensaje de error
            console.error(error);
            this.isLoading = false; // Detiene el indicador de carga
          }
        );
    }
  }

  resetForm() {
    this.editedEmpleado = null;
    this.editEmpleadoData = {
      estado: '',
      fechaContratacion: null,
      user: {
        ci: '',
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        telefono: '',
        email: '',
      },
      especialidades: [],
    };
  }

  autoFillForm(ci: string) {
    if (!ci) return;

    this.apiService.getUserByCI(ci).subscribe(
      (user: any) => {
        if (user) {
          // El usuario existe, rellenar los datos
          this.editEmpleadoData.user = {
            id: user.id, // Asegúrate de obtener el ID del usuario
            ci: user.ci,
            nombre: user.nombre,
            apellido_paterno: user.apellido_paterno,
            apellido_materno: user.apellido_materno,
            telefono: user.telefono,
            email: user.username, // Asumiendo que el email está en username
            fecha_nacimiento: user.fecha_nacimiento
              ? new Date(user.fecha_nacimiento)
              : null,
            genero: user.genero,
          };
        } else {
          // El usuario no existe, permitir ingresar los datos
          this.editEmpleadoData.user = {
            id: null,
            ci: ci,
            nombre: '',
            apellido_paterno: '',
            apellido_materno: '',
            telefono: '',
            email: '',
            fecha_nacimiento: null,
            genero: '',
          };
        }
      },
      (error: any) => {
        // Manejar el error o usuario no encontrado
        console.error('No se pudo obtener el usuario', error);
        this.editEmpleadoData.user = {
          id: null,
          ci: ci,
          nombre: '',
          apellido_paterno: '',
          apellido_materno: '',
          telefono: '',
          email: '',
          fecha_nacimiento: null,
          genero: '',
        };
      }
    );
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // En manage-empleados.component.ts

  getEspecialidadesList(empleado: any): string[] {
    if (empleado && empleado.especialidades) {
      return empleado.especialidades.map((e: any) => e.nombre);
    }
    return [];
  }
}
