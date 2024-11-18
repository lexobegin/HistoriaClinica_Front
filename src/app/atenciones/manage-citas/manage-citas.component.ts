import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Cita } from '../../models/citas.model';
import { formatDate } from '@angular/common';

import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';


@Component({
  selector: 'app-manage-citas',
  standalone: true,
  imports: [ CommonModule,
    FormsModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
  ],
  templateUrl: './manage-citas.component.html',
  styleUrl: './manage-citas.component.css'
})
export class ManageCitasComponent {
  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  selectedDate: string | null = null;
  selectedEstado: string | null = 'activa';
  isLoading: boolean = false;
  isModalVisible = false;
  selectedCita: Cita | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = formatDate(today, 'yyyy-MM-dd', 'en');
    this.selectedEstado = 'pendiente';
    this.loadCitas();
  }

  loadCitas() {
    this.isLoading = true;
    this.apiService.getCitas().subscribe(
      (data: Cita[]) => {
        this.citas = data;
        this.filterCitas();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar las citas:', error);
        this.isLoading = false;
      }
    );
  }

  filterCitas() {
    this.citasFiltradas = this.citas.filter((cita) => {
      const matchesDate =
        !this.selectedDate || cita.fecha === this.selectedDate;
      const matchesEstado =
        !this.selectedEstado || cita.estado === this.selectedEstado;
      return matchesDate && matchesEstado;
    });
  }

  viewCitaDetails(cita: Cita) {
    this.selectedCita = cita;
    this.isModalVisible = true;
  }

  handleOk(): void {
    this.isModalVisible = false;
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  cancelarCita(id: number | undefined) {
    if (!id) return;
  
    if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      this.apiService.cancelarCita(id).subscribe(
        () => {
          alert('Cita cancelada exitosamente.');
          this.loadCitas(); // Recargar las citas para actualizar el estado
          this.isModalVisible = false; // Cerrar el modal
        },
        (error) => {
          console.error('Error al cancelar la cita:', error);
          alert('Hubo un problema al cancelar la cita.');
        }
      );
    }
  }
  
}
