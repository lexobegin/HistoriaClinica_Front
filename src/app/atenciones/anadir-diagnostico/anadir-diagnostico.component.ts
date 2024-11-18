import { Component, Input, OnInit  } from '@angular/core';
import { ApiService } from '../../api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-anadir-diagnostico',
  standalone: true,
  imports: [ FormsModule,
    NzFormModule,
    NzSelectModule,
    NzCardModule,
    ReactiveFormsModule

  ],
  templateUrl: './anadir-diagnostico.component.html',
  styleUrl: './anadir-diagnostico.component.css'
})
export class AnadirDiagnosticoComponent  implements OnInit {
  @Input() citaId!: number;
  @Input() consultaId!: number;
  //diagnosticoText: string = '';
  editMode = false;
  diagnosticoForm!: FormGroup;
  diagnosticoId!: number;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.diagnosticoForm = this.fb.group({
      tipoDiagnostico: [null, [Validators.required]],
      sintomas: [null, [Validators.required]],
      observaciones: [null],
    });

    // Verificar si ya existe un diagnóstico para esta consulta
    this.apiService.getDiagnosticoByConsultaId(this.consultaId).subscribe(
      (data) => {
        if (data) {
          this.editMode = true;
          this.diagnosticoId = data.id;
          // Cargar los datos en el formulario
          this.diagnosticoForm.patchValue({
            tipoDiagnostico: data.tipoDiagnostico,
            sintomas: data.sintomas,
            observaciones: data.observaciones,
          });
        }
      },
      (error) => {
        console.error('Error al obtener diagnóstico:', error);
        // Si no existe diagnóstico, permanecemos en modo creación
      }
    );
  }

  guardarDiagnostico() {
    if (this.diagnosticoForm.invalid) {
      this.message.warning('Por favor, completa el formulario antes de guardar.');
      return;
    }

    const diagnosticoData = {
      consultaId: this.consultaId,
      ...this.diagnosticoForm.value,
      fecha: new Date(),
    };

    if (this.editMode) {
      // Actualizar diagnóstico existente
      this.apiService.actualizarDiagnostico(this.diagnosticoId, diagnosticoData).subscribe(
        () => {
          this.message.success('Diagnóstico actualizado correctamente.');
        },
        (error) => {
          console.error('Error al actualizar diagnóstico:', error);
          this.message.error('Error al actualizar el diagnóstico.');
        }
      );
    } else {
      // Crear nuevo diagnóstico
      this.apiService.guardarDiagnostico(diagnosticoData).subscribe(
        (response) => {
          this.message.success('Diagnóstico guardado correctamente.');
          this.editMode = true;
          this.diagnosticoId = response.id;
        },
        (error) => {
          console.error('Error al guardar diagnóstico:', error);
          this.message.error('Error al guardar el diagnóstico.');
        }
      );
    }
  }



  limpiarFormulario() {
    this.diagnosticoForm.reset();
  }

}
