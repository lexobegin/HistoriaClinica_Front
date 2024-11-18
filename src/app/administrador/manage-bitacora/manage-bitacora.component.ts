import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';

// Interfaz para los registros de bitácora
export interface BitacoraRegistro {
  id: number;
  ip: string;
  ci: string;
  fecha: string;
  hora: string;
  accion: string;
  tablaAfectada: string;
}

@Component({
  selector: 'app-manage-bitacora',
  templateUrl: './manage-bitacora.component.html',
  styleUrls: ['./manage-bitacora.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ManageBitacoraComponent implements OnInit {
  bitacora: BitacoraRegistro[] = []; // Todos los registros de la bitácora
  paginatedBitacora: BitacoraRegistro[] = []; // Registros que se muestran en la página actual
  currentPage: number = 1; // Página actual
  pageSize: number = 10; // Tamaño de cada página
  totalPages: number = 1; // Total de páginas

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarBitacora();
  }

  // Cargar todos los registros de la bitácora
  cargarBitacora() {
    this.apiService.getBitacora().subscribe(
      (data: BitacoraRegistro[]) => {
        this.bitacora = data.map((registro: BitacoraRegistro) => {
          // Extrae solo la parte de hora sin milisegundos
          registro.hora = registro.hora.split('.')[0];
          return registro;
        });
        this.calculatePagination();
      },
      (error) => {
        console.error('Error al cargar la bitácora', error);
      }
    );
  }

  // Calcular la paginación y obtener la primera página
  calculatePagination() {
    this.totalPages = Math.ceil(this.bitacora.length / this.pageSize);
    this.getPaginatedData();
  }

  // Obtener los datos paginados para la página actual
  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBitacora = this.bitacora.slice(startIndex, endIndex);
  }

  // Cambiar a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getPaginatedData();
    }
  }

  // Cambiar a la página siguiente
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getPaginatedData();
    }
  }
}