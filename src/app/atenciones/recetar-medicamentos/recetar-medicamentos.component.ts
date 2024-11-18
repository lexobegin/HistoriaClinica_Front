import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import {
  NzAutocompleteModule,
  NzAutocompleteOptionComponent,
} from 'ng-zorro-antd/auto-complete';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ApiService } from '../../api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-recetar-medicamentos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzAutocompleteModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule,
    NzCardModule,
    FormsModule,
    NzAutocompleteOptionComponent,
  ],
  templateUrl: './recetar-medicamentos.component.html',
  styleUrl: './recetar-medicamentos.component.css',
})
export class RecetarMedicamentosComponent implements OnInit {
  @Input() citaId!: number;
  @Input() consultaId!: number;
  medicamentoForm!: FormGroup;
  medicamentosFiltrados: string[] = [];
  listaMedicamentosSeleccionados: any[] = [];
  mostrarCampoManual = false;
  medicamentoManual: string = '';
  receta: any;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.medicamentoForm = this.fb.group({
      medicamento: [null, [Validators.required]],
    });
    this.cargarReceta();
  }



  buscarMedicamentos(value: string): void {
    if (value.length > 2) {
      this.apiService.buscarMedicamentosRxNorm(value).subscribe(
        (medicamentos: string[]) => {
          this.medicamentosFiltrados = medicamentos;
        },
        (error) => {
          console.error('Error al buscar medicamentos en RxNorm:', error);
        }
      );
    } else {
      this.medicamentosFiltrados = [];
    }
  }

  seleccionarMedicamento(option: NzAutocompleteOptionComponent): void {
    const medicamento = option.nzValue; // Extraer el valor del objeto
    this.listaMedicamentosSeleccionados.push({
      nombre: medicamento,
      dosis: '',
      instrucciones: '',
    });
    this.medicamentoForm.reset();
    this.medicamentosFiltrados = [];
  }

  eliminarMedicamento(index: number): void {
    this.listaMedicamentosSeleccionados.splice(index, 1);
  }

  toggleAgregarManual(): void {
    this.mostrarCampoManual = !this.mostrarCampoManual;
    this.medicamentoManual = ''; // Limpiar el campo cuando se oculta
  }

  agregarMedicamentoManual(): void {
    if (this.medicamentoManual.trim()) {
      // Añade el medicamento manualmente a la lista de medicamentos seleccionados
      this.listaMedicamentosSeleccionados.push({
        nombre: this.medicamentoManual,
        dosis: '',
        instrucciones: '',
      });
      // Limpia el campo después de agregarlo y oculta el campo de entrada manual
      this.medicamentoManual = '';
      this.mostrarCampoManual = false;
      this.message.success('Medicamento agregado manualmente.');
    } else {
      this.message.warning('El nombre del medicamento no puede estar vacío.');
    }
  }

  guardarReceta(): void {
    const recetaData = {
      consultaId: this.consultaId,
      medicamentos: this.listaMedicamentosSeleccionados,
      fecha: new Date(),
    };

    if (this.receta && this.receta.id) {
      // Actualizar receta existente
      this.apiService.actualizarReceta(this.receta.id, recetaData).subscribe(
        () => {
          this.message.success('Receta actualizada correctamente.');
          this.cargarReceta(); // Recargar la receta actualizada
        },
        (error) => {
          console.error('Error al actualizar la receta:', error);
          this.message.error('No se pudo actualizar la receta. Verifique la conexión o los datos ingresados.');
        }
      );
    } else {
      // Crear nueva receta si no existe
      this.apiService.guardarReceta(recetaData).subscribe(
        (nuevaReceta) => {
          this.message.success('Receta guardada correctamente.');
          this.receta = nuevaReceta; // Asignar la nueva receta
          this.cargarReceta(); // Recargar la receta guardada
        },
        (error) => {
          console.error('Error al guardar la receta:', error);
          this.message.error('No se pudo guardar la receta. Verifique la conexión o los datos ingresados.');
        }
      );
    }
  }



  cargarReceta(): void {
    this.apiService.obtenerRecetasPorConsulta(this.consultaId).subscribe(
      (receta: any) => {
        if (receta) {
          // Asigna la receta obtenida a la variable 'receta'
          this.receta = receta;
          // Asigna la lista de medicamentos de la receta a 'listaMedicamentosSeleccionados'
          this.listaMedicamentosSeleccionados = receta.medicamentos || [];
          this.message.success('Receta cargada correctamente.');
        } else {
          this.receta = null;
          this.listaMedicamentosSeleccionados = [];
          this.message.info('No hay receta existente para esta consulta.');
        }
      },
      (error) => {
        console.error('Error al cargar la receta:', error);
        this.message.error('Error al cargar la receta. Por favor, intente nuevamente.');
      }
    );
  }
  
}
