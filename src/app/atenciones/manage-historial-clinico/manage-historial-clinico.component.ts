import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-manage-historial-clinico',
  templateUrl: './manage-historial-clinico.component.html',
  styleUrls: ['./manage-historial-clinico.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    FormsModule,
    NzModalModule,
  ]
})
export class ManageHistorialClinicoComponent implements OnInit {
  username: string = '';
  users: any[] = [];
  antecedentes: any = null;
  isModalVisible = false;

  constructor(private apiService: ApiService, private modal: NzModalService) {}

  ngOnInit(): void {}

  buscarUsuario() {
    if (this.username.trim() === '') {
      return;
    }
    this.apiService.getUserByUsername(this.username).subscribe(
      (data) => {
        this.users = Array.isArray(data) ? data : [data];
        this.antecedentes = null;
      },
      (error) => {
        console.error('Error al buscar usuario', error);
      }
    );
  }

  cargarAntecedentes(userId: number) {
    this.apiService.getAntecedentesByUserId(userId).subscribe(
      (data) => {
        this.antecedentes = data; // Asigna los datos de antecedentes a la variable
        console.log('Datos de antecedentes:', this.antecedentes); // Verifica los datos aquí
        this.isModalVisible = true; // Muestra el modal
      },
      (error) => {
        console.error('Error al cargar antecedentes', error);
        this.antecedentes = null; // Asegura que se limpie si hay un error
        this.isModalVisible = true; // Aun así, muestra el modal para indicar que no hay datos
      }
    );
  }

  verAntecedentes(userId: number) {
    this.cargarAntecedentes(userId);
  }

  closeModal() {
    this.isModalVisible = false;
  }
}