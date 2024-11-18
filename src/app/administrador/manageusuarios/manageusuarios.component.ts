import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';  // Ajusta la ruta si es necesario
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-manage-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzInputModule,
    NzPaginationModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './manageusuarios.component.html',
  styleUrls: ['./manageusuarios.component.css']
})
export class ManageUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  total: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios() {
    this.apiService.getUsuarios().subscribe(
      (data: any) => {
        this.usuarios = data;
        this.filterUsuarios(); // Aplicar filtro inicial
      },
      (error) => {
        console.error('Error al obtener usuarios', error);
      }
    );
  }

  // Función de búsqueda
  filterUsuarios() {
    const term = this.searchTerm.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter((usuario) =>
      usuario.nombre.toLowerCase().includes(term) ||
      usuario.ci.toLowerCase().includes(term) ||
      usuario.apellido_paterno.toLowerCase().includes(term)
    );
    this.total = this.usuariosFiltrados.length;
    this.currentPage = 1;
  }

  // Función para manejar el cambio de página
  onPageChange(pageIndex: number) {
    this.currentPage = pageIndex;
  }
}
