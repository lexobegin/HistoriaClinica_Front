import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list'; // Importa NzListModule de NG-Zorro

@Component({
  selector: 'app-ver-antecedentes',
  templateUrl: './ver-antecedentes.component.html',
  styleUrls: ['./ver-antecedentes.component.css'],
  standalone: true,
  imports: [CommonModule, NzListModule] // Asegúrate de incluir NzListModule aquí
})
export class VerAntecedentesComponent implements OnInit {
  userId: number | null = null;
  antecedentes: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('userId')!;
    this.cargarAntecedentes();
  }

  cargarAntecedentes() {
    if (this.userId !== null) {
      this.apiService.getAntecedentesByUserId(this.userId).subscribe(
        (data) => {
          this.antecedentes = data;
        },
        (error) => {
          console.error('Error al cargar antecedentes', error);
        }
      );
    }
  }
}