import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import {
  HorarioMedico,
  BloqueMedico,
  Medico,
  HorarioMedicoUpdate,
  Servicio,
} from '../../models/horario-medico.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Router } from '@angular/router';
import { Cita } from '../../models/citas.model';

@Component({
  selector: 'app-manage-horarios-medicos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
  ],
  templateUrl: './manage-programacion-medicos.component.html',
  styleUrls: ['./manage-programacion-medicos.component.css'],
})
export class ManageProgramacionMedicosComponent implements OnInit {
  horarios: HorarioMedico[] = [];
  horariosPaginados: HorarioMedico[] = [];
  citas: Cita[] = []; 
  selectedMedicoId: number | null = null;
  isLoading: boolean = false;
  selectedDate: string | null = null; // Nueva propiedad para la fecha seleccionada
  isEditMode: boolean = false;
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  isModalVisible = false;
  modalTitle = 'Crear Horario Médico';
  time: number = 0;
  editHorarioData: HorarioMedico = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    cupoTotal: 0,
    cupoDisponible: 0,
    medico: { id: 0, nombre: '' },
    servicio: { id: 0, nombre: '' },
    bloques: [],
  };
  departamentos: any[] = []; // Si necesitas departamentos asociados
  medicos: Medico[] = [];
  servicios: Servicio[] = [];
  errorMessage: string = '';
  

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadCitas();
    this.loadHorarios();
    this.loadMedicos();
    this.loadServicios();
    // Si tienes departamentos, descomenta la siguiente línea
    // this.loadDepartamentos();
  }

  loadHorarios() {
    this.loadCitas();
    this.apiService.listarHorariosMedicos().subscribe(
      (data: any[]) => {
        // Mapea los datos para extraer el nombre completo del médico
        this.horarios = data.map((horario) => ({
          ...horario,
          medico: {
            ...horario.medico,
            nombre: `${horario.medico.user.nombre} ${horario.medico.user.apellidoPaterno} ${horario.medico.user.apellidoMaterno}`,
          },
        }));
        this.paginateHorarios();
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Error al cargar los horarios médicos.';
      }
    );
  }

  loadMedicos() {
    this.apiService.getEmpleados().subscribe(
      (data: any[]) => {
        this.medicos = data.map((empleado) => ({
          id: empleado.id, // ID del empleado o del médico
          nombre: `${empleado.user.nombre} ${empleado.user.apellidoPaterno} ${empleado.user.apellidoMaterno}`,
        }));
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Error al cargar la lista de médicos.';
      }
    );
  }

  loadHorariosPorMedico() {
    if (this.selectedMedicoId) {
      this.apiService.listarHorariosMedico(this.selectedMedicoId).subscribe(
        (data: any[]) => {
          // Mapea los datos para extraer el nombre completo del médico
          this.horarios = data.map((horario) => ({
            ...horario,
            medico: {
              ...horario.medico,
              nombre: `${horario.medico.user.nombre} ${horario.medico.user.apellidoPaterno} ${horario.medico.user.apellidoMaterno}`,
            },
          }));
          this.paginateHorarios();
        },
        (error) => {
          console.error(error);
          this.errorMessage = 'Error al cargar los horarios médicos.';
        }
      );
    } else {
      this.horarios = []; // Reinicia si no hay un médico seleccionado
      this.paginateHorarios();
    }
  }

  loadHorariosPorMedicoYFecha() {
    if (!this.selectedMedicoId) {
      this.isLoading = true;
      this.apiService.listarHorariosMedicos().subscribe(
        (data: any[]) => {
          this.horarios = data.map((horario) => ({
            ...horario,
            medico: {
              ...horario.medico,
              nombre: `${horario.medico.user.nombre} ${horario.medico.user.apellidoPaterno} ${horario.medico.user.apellidoMaterno}`,
            },
          }));

          // Si el campo citaId ya está presente en cada bloque desde el backend, no se necesita asignación adicional
          this.horarios.forEach((horario) => {
            horario.bloques.forEach((bloque) => {
              // Para asegurarnos de que citaId esté definido si es necesario
              if (typeof bloque.citaId === 'undefined') {
                bloque.citaId = null;
              }
            });
          });

          this.paginateHorarios();
          this.isLoading = false;
        },
        (error) => {
          console.error(error);
          this.errorMessage = 'Error al cargar los horarios médicos.';
          this.isLoading = false;
        }
      );
    }
  }

  loadServicios() {
    this.apiService.getServicios().subscribe(
      (data: any[]) => {
        this.servicios = data.map((servicio) => ({
          id: servicio.id, // ID del empleado o del médico
          nombre: `${servicio.nombre} `,
        }));
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Error al cargar la lista de servicios.';
      }
    );
  }
  // Si necesitas cargar departamentos, implementa este método
  /*
  loadDepartamentos() {
    this.apiService.getDepartamentos().subscribe(
      (data: any[]) => {
        this.departamentos = data;
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Error al cargar la lista de departamentos.';
      }
    );
  }
  */

  openCreateModal() {
    this.modalTitle = 'Crear Horario Médico';
    this.editHorarioData = {
      fecha: '',
      horaInicio: '',
      horaFin: '',
      cupoTotal: 0,
      cupoDisponible: 0,
      medico: { id: 0, nombre: '' },
      servicio: { id: 0, nombre: '' },
      bloques: [],
    };
    this.isModalVisible = true;
    this.isEditMode = false; // Indica que estamos en modo de creación
  }

  openEditModal(horario: HorarioMedico) {
    this.modalTitle = 'Editar Horario Médico';
    this.editHorarioData = { ...horario };
    this.isModalVisible = true;
    this.isEditMode = true; // Indica que estamos en modo de edición
  }

  handleOk() {
    if (this.modalTitle === 'Crear Horario Médico') {
      this.createHorario();
    } else {
      this.updateHorario();
    }
    this.isModalVisible = false;
  }

  handleCancel() {
    this.isModalVisible = false;
  }

  createHorario() {
    // Recalcular el cupo disponible antes de enviar los datos
    console.log(
      'Cupo disponible antes de enviar:',
      this.editHorarioData.cupoDisponible
    );

    // Validar que los bloques estén generados
    if (this.editHorarioData.bloques.length === 0) {
      alert('Por favor, genera los bloques antes de enviar.');
      return;
    }
    console.log(
      'Cupo disponible antes de enviar:',
      this.editHorarioData.cupoDisponible
    );

    this.apiService.crearHorarioMedico(this.editHorarioData).subscribe(
      (response) => {
        this.loadHorarios();
        this.loadCitas();
        alert('Horario médico creado exitosamente.');
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Error al crear el horario médico.';
      }
    );
  }

  updateHorario() {
    // Usamos la nueva interfaz `HorarioMedicoUpdate`
    const horarioData: HorarioMedicoUpdate = {
      fecha: this.editHorarioData.fecha,
      horaInicio: this.editHorarioData.horaInicio,
      horaFin: this.editHorarioData.horaFin,
      cupoTotal: this.editHorarioData.cupoTotal,
      cupoDisponible: this.editHorarioData.cupoDisponible,
      medico: { id: this.editHorarioData.medico.id }, // Solo enviar el ID del médico
      servicio: { id: this.editHorarioData.servicio.id },
      bloques: this.editHorarioData.bloques.map((bloque) => ({
        id: bloque.id,
        horaInicio: bloque.horaInicio,
        horaFin: bloque.horaFin,
        disponibilidad: bloque.disponibilidad,
      })),
    };

    this.apiService
      .actualizarHorarioMedico(this.editHorarioData.id!, horarioData)
      .subscribe(
        (response) => {
          alert('Horario médico actualizado exitosamente.');
          this.loadHorarios();
          this.loadCitas();
        },
        (error) => {
          console.error('Error en la actualización:', error);
          this.errorMessage = 'Error al actualizar el horario médico.';
        }
      );
  }

  confirmDelete(id: number) {
    if (confirm('¿Estás seguro de eliminar este horario médico?')) {
      this.deleteHorario(id);
    }
  }

  deleteHorario(id: number) {
    this.apiService.eliminarHorarioMedico(id).subscribe(
      () => {
        alert('Horario médico eliminado exitosamente.');
        this.loadHorarios();
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Error al eliminar el horario médico.';
      }
    );
  }

  paginateHorarios() {
    this.totalPages = Math.ceil(this.horarios.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    this.horariosPaginados = this.horarios.slice(start, start + this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateHorarios();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateHorarios();
    }
  }

  // Método para generar bloques automáticamente
  generarBloques(horarioForm: NgForm) {
    const horaInicio = this.editHorarioData.horaInicio;
    const horaFin = this.editHorarioData.horaFin;
    const duracionCitaMin = this.time; // Se puede modificar dinámicamente

    this.editHorarioData.bloques = this.calcularBloques(
      horaInicio,
      horaFin,
      duracionCitaMin
    );
    this.editHorarioData.cupoTotal = this.editHorarioData.bloques.length;
    this.editHorarioData.cupoDisponible = this.editHorarioData.cupoTotal;
  }

  calcularBloques(
    horaInicio: string,
    horaFin: string,
    duracionCitaMin: number
  ): BloqueMedico[] {
    const bloques: BloqueMedico[] = [];

    // Verificación de entrada: si horaInicio o horaFin no están definidos, retorna un arreglo vacío
    if (!horaInicio || !horaFin) {
      return bloques;
    }

    const [inicioHoras, inicioMinutos] = horaInicio.split(':').map(Number);
    const [finHoras, finMinutos] = horaFin.split(':').map(Number);

    // Verificación de valores NaN: si los valores de horas o minutos son inválidos, retorna un arreglo vacío
    if (
      isNaN(inicioHoras) ||
      isNaN(inicioMinutos) ||
      isNaN(finHoras) ||
      isNaN(finMinutos)
    ) {
      return bloques;
    }

    const startTime = new Date();
    startTime.setHours(inicioHoras, inicioMinutos, 0, 0);

    const endTime = new Date();
    endTime.setHours(finHoras, finMinutos, 0, 0);

    // Si la duración de la cita es 0, crea un bloque único desde inicio hasta fin
    if (duracionCitaMin <= 0) {
      const bloque: BloqueMedico = {
        horaInicio: this.formatTime(startTime),
        horaFin: this.formatTime(endTime),
        disponibilidad: true,
      };
      bloques.push(bloque);
    } else {
      let currentTime = startTime;

      while (currentTime < endTime) {
        const nextTime = new Date(
          currentTime.getTime() + duracionCitaMin * 60000
        );
        if (nextTime > endTime) break;

        const bloque: BloqueMedico = {
          horaInicio: this.formatTime(currentTime),
          horaFin: this.formatTime(nextTime),
          disponibilidad: true,
        };

        bloques.push(bloque);
        currentTime = nextTime;
      }
    }

    return bloques;
  }

  formatTime(date: Date): string {
    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  recalcularCupoDisponible() {
    this.editHorarioData.cupoDisponible = this.editHorarioData.bloques.filter(
      (bloque) => bloque.disponibilidad
    ).length;
  }


  loadCitas() {
    this.apiService.getCitas().subscribe(
      (data: Cita[]) => {
        this.citas = data;
        this.asignarCitasABloques(); // Asigna las citas a los bloques de horarios
      },
      (error) => {
        console.error('Error al cargar las citas:', error);
        this.errorMessage = 'Error al cargar las citas agendadas.';
      }
    );
  }


  // asignarCitasABloques() {
  //   this.horarios.forEach((horario) => {
  //     horario.bloques.forEach((bloque) => {
  //       const citaEncontrada = this.citas.find(
  //         (cita) =>
  //           cita.fecha === horario.fecha &&
  //           cita.horaInicio === bloque.horaInicio &&
  //           cita.horaFin === bloque.horaFin
  //       );
  //       if (citaEncontrada) {
  //         bloque.citaId = citaEncontrada.id; // Asignar la citaId al bloque
  //       } else {
  //         bloque.citaId = undefined; // Dejar en undefined si no hay cita
  //       }
  //     });
  //   });
  // }
  asignarCitasABloques() {
    this.horarios.forEach((horario) => {
      horario.bloques.forEach((bloque) => {
        const citaEncontrada = this.citas.find(
          (cita) =>
            cita.fecha === horario.fecha &&
            cita.horaInicio === bloque.horaInicio &&
            cita.horaFin === bloque.horaFin &&
            (cita.estado === 'activa' || cita.estado === 'pendiente') // Solo asigna si no está cancelada
        );
        bloque.citaId = citaEncontrada ? citaEncontrada.id : undefined;
      });
    });
  }
  
  
}
