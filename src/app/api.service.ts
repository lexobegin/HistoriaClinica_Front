import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; // Asegúrate de importar HttpClient
import { Observable, from, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {
  HorarioMedico,
  HorarioMedicoUpdate,
} from './models/horario-medico.model';

import { Cita } from './models/citas.model';

import { jwtDecode } from 'jwt-decode'; // Corrige el import de jwtDecode
@Injectable({
  providedIn: 'root',
})
export class ApiService {
 
  private baseUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) {} // Asegúrate de que HttpClient sea parte del constructor

  // Método para registrar usuarioGIT
  register(userData: any): Observable<any> {
    const url = `${this.baseUrl}/auth/register`;
    return this.http.post(url, userData);
  }

  // Método para login
  login(credentials: any): Observable<any> {
    const url = `${this.baseUrl}/auth/login`;
    return this.http.post(url, credentials).pipe(
      tap((response: any) => {
        // Almacena el token en localStorage si la autenticación es exitosa
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  // Método para obtener los datos completos del usuario por su username
  getUserByUsername(username: string): Observable<any> {
    const url = `${this.baseUrl}/auth/getUserByUsername`;
    const token = localStorage.getItem('token') || ''; // Usar el token almacenado para autenticación
    return this.http.post(
      url,
      { username },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  getUserByCI(ci: string): Observable<any> {
    const url = `${this.baseUrl}/auth/users/ci/${ci}`;
    return this.http.get(url);
  }

  // Método para obtener usuarios
  getUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/users`);
  }

  // Obtener roles
  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/auth/roles`);
  }

  // Crear un rol
  createRole(rol: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/roles`, rol);
  }

  // Editar un rol
  updateRole(id: number, rol: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/auth/roles/${id}`, rol);
  }

  // Eliminar un rol
  deleteRole(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/auth/roles/${id}`);
  }

  getEspecialidades(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/auth/especialidades`);
  }

  createEspecialidad(especialidad: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/auth/especialidades/crear`,
      especialidad
    );
  }

  updateEspecialidad(id: number, especialidad: any): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/auth/especialidades/${id}`,
      especialidad
    );
  }

  deleteEspecialidad(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/auth/especialidades/eliminar/${id}`
    );
  }

  // Obtener lista de empleados
  getEmpleados(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/medicos`);
  }

  // Crear un nuevo empleado
  createEmpleado(
    empleadoData: any,
    id: number,
    rolId: number
  ): Observable<any> {
    const url = `${this.baseUrl}/auth/medicos/crear/${id}?rolId=${rolId}`;
    return this.http.post(url, empleadoData);
  }

  // Editar un empleado
  // updateEmpleado(id: number, empleadoData: any): Observable<any> {
  //   return this.http.put(
  //     `${this.baseUrl}/auth/medicos/editar/${id}?rolId=${empleadoData.rolId}`,
  //     empleadoData
  //   );
  // }
  updateEmpleado(
    id: number,
    empleadoData: any,
    rolId: number
  ): Observable<any> {
    const url = `${this.baseUrl}/auth/medicos/editar/${id}?rolId=${rolId}`;
    return this.http.put(url, empleadoData);
  }

  // Método para obtener un médico por ID
  getEmpleadoById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/medicos/${id}`);
  }

  // Obtener lista de permisos
  getPermissions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/permisos`);
  }

  // Obtener permisos por rol ID
  getRolePermissions(roleId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/roles/${roleId}`);
  }

  // Actualizar permisos del rol
  updateRolePermissions(roleId: number, permissionsData: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/auth/roles/editar/${roleId}`,
      permissionsData
    );
  }

  // API para listar departamentos
  getDepartamentos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/departamentos`);
  }

  // API para obtener un departamento por ID
  getDepartamentoById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/departamentos/${id}`);
  }

  // Obtener un servicio por ID
  getServicioById(id: number): Observable<any> {
    const url = `${this.baseUrl}/auth/servicios/obtener/${id}`;
    return this.http.get(url);
  }

  // Listar todos los servicios
  getServicios(): Observable<any> {
    const url = `${this.baseUrl}/auth/servicios`;
    return this.http.get(url);
  }

  // Editar un servicio existente
  updateServicio(id: number, servicioData: any): Observable<any> {
    const url = `${this.baseUrl}/auth/servicios/editar/${id}`;
    const token = localStorage.getItem('token') || ''; // Token almacenado en localStorage
    return this.http.put(url, servicioData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Eliminar un servicio por ID
  deleteServicio(id: number): Observable<any> {
    const url = `${this.baseUrl}/auth/servicios/eliminar/${id}`;
    const token = localStorage.getItem('token') || ''; // Token almacenado en localStorage
    return this.http.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  //-------apis horario --- estan en prueba
  crearHorarioMedico(horario: HorarioMedico): Observable<HorarioMedico> {
    const url = `${this.baseUrl}/auth/horarios`;
    //const token = localStorage.getItem('token') || '';
    return this.http.post<HorarioMedico>(url, horario, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });
  }

  // Obtener todos los Horarios_medico
  listarHorariosMedicos(): Observable<HorarioMedico[]> {
    const url = `${this.baseUrl}/auth/horarios`;
    //const token = localStorage.getItem('token') || '';
    return this.http.get<HorarioMedico[]>(url, {
      headers: {
        //'Authorization': `Bearer ${token}`
      },
    });
  }

  // Obtener un Horario_medico por ID
  obtenerHorarioMedicoPorId(id: number): Observable<HorarioMedico> {
    const url = `${this.baseUrl}/auth/horarios/${id}`;
    const token = localStorage.getItem('token') || '';
    return this.http.get<HorarioMedico>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Ajuste en ApiService para que acepte `HorarioMedicoUpdate`
  actualizarHorarioMedico(
    id: number,
    horario: HorarioMedicoUpdate
  ): Observable<HorarioMedico> {
    const url = `${this.baseUrl}/auth/horarios/${id}`;
    return this.http.put<HorarioMedico>(url, horario, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Eliminar un Horario_medico
  eliminarHorarioMedico(id: number): Observable<void> {
    const url = `${this.baseUrl}/auth/horarios/${id}`;
    // const token = localStorage.getItem('token') || '';
    return this.http.delete<void>(url, {
      headers: {
        //'Authorization': `Bearer ${token}`
      },
    });
  }

  // Obtener los horarios de un médico específico
  listarHorariosMedico(medicoId: number): Observable<HorarioMedico[]> {
    const url = `${this.baseUrl}/auth/horarios/medico/${medicoId}`;
    return this.http.get<HorarioMedico[]>(url);
  }

  // Método para obtener los registros de la bitácora
  getBitacora(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/bitacora`);
  }

  // Método para registrar una acción en la bitácora
  registrarBitacora(accion: string, tablaAfectada: string): Observable<any> {
    // Llama a obtenerIP y obtenerCIDelUsuario para obtener los valores dinámicos
    return from(
      this.obtenerIP().then((ip) => {
        const ci = this.obtenerCIDelUsuario();
        const bitacora = { ip, ci, accion, tablaAfectada };
        return this.http
          .post(`${this.baseUrl}/auth/bitacora/registrar`, bitacora)
          .toPromise();
      })
    );
  }

  async obtenerIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json'); // Servicio público de IP
      const data = await response.json();
      return data.ip; // Retorna la IP obtenida
    } catch (error) {
      console.error('Error al obtener la IP:', error);
      return '255.255.255.255'; // Retorna una IP por defecto si no se puede obtener la real
    }
  }

  // API para crear un nuevo departamento
  createDepartamento(departamentoData: any): Observable<any> {
    const url = `${this.baseUrl}/auth/departamentos/crear`;
    const token = localStorage.getItem('token') || ''; // Token almacenado en localStorage
    return this.http.post(url, departamentoData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // API para actualizar un departamento
  updateDepartamento(id: number, departamento: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/auth/departamentos/actualizar/${id}`,
      departamento
    );
  }

  // API para eliminar un departamento
  deleteDepartamento(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/auth/departamentos/eliminar/${id}`
    );
  }

  // Crear un nuevo servicio
  createServicio(servicioData: any): Observable<any> {
    const url = `${this.baseUrl}/auth/servicios/crear`;
    const token = localStorage.getItem('token') || ''; // Token almacenado en localStorage
    return this.http.post(url, servicioData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}/auth/citas`);
  }

  cancelarCita(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/auth/citas/cancelar/${id}`, {});
  }

  obtenerCIDelUsuario(): string {
    const token = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (token) {
      try {
        console.log('Contenido del token decodificado:', token); // Agrega esto para ver los datos del token
        return token.ci || 'Desconocido'; // Cambia 'ci' por el campo correcto después de verificar
      } catch (error) {
        console.error('Error al decodificar el token', error);
      }
    }
    return 'Desconocido';
  }

  // Método para obtener la lista de triaje
  getTriageList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/auth/triaje`);
  }

  // Método para registrar un nuevo triaje
  registerTriage(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/triaje/crear`, data);
  }

  // Método para obtener todos los antecedentes
  getAllAntecedentes(): Observable<any> {
    const url = `${this.baseUrl}/auth/antecedente`;
    return this.http.get(url);
  }

  // Método para obtener un antecedente por ID
  getAntecedenteById(id: number): Observable<any> {
    const url = `${this.baseUrl}/auth/antecedente/${id}`;
    return this.http.get(url);
  }

  // Método para crear un nuevo antecedente
  createAntecedente(antecedenteData: any): Observable<any> {
    const url = `${this.baseUrl}/auth/antecedente/crear`;
    return this.http.post(url, antecedenteData);
  }

  // Método para actualizar un antecedente
  updateAntecedente(id: number, antecedenteData: any): Observable<any> {
    const url = `${this.baseUrl}/auth/antecedente/editar/${id}`;
    return this.http.put(url, antecedenteData);
  }

  // Método para eliminar un antecedente
  deleteAntecedente(id: number): Observable<any> {
    const url = `${this.baseUrl}/auth/antecedente/eliminar/${id}`;
    return this.http.delete(url);
  }

  getAntecedentesByUserId(userId: number): Observable<any> {
    const url = `${this.baseUrl}/auth/antecedente/usuario/${userId}`;
    const token = localStorage.getItem('token') || ''; // Obtén el token del localStorage
    return this.http.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Asegúrate de que el token esté en este formato
      },
    });
  }

  actualizarUsuario(userId: number, usuario: any) {
    const userUpdateData = {
      nombre: usuario.nombre,
      apellido_paterno: usuario.apellido_paterno,
      apellido_materno: usuario.apellido_materno,
      fecha_nacimiento: usuario.fecha_nacimiento,
      telefono: usuario.telefono,
      genero: usuario.genero,
      ci: usuario.ci,
      username: usuario.username,
    };
    return this.http.put<any>(
      `${this.baseUrl}/auth/users/${userId}/update`,
      userUpdateData
    );
  }

  getCitasByMedicoUserId(userId: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.baseUrl}/auth/citas/medico/${userId}`);
  }

  getCitaById(citaId: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.baseUrl}/auth/citas/obtener/${citaId}`);
  }

  private rxNormUrl = 'https://rxnav.nlm.nih.gov/REST/drugs.json';
  buscarMedicamentosRxNorm(query: string): Observable<string[]> {
    if (!query.trim()) {
      return of([]); // Si la búsqueda está vacía, retorna un array vacío
    }

    const params = new HttpParams().set('name', query);

    return this.http.get<any>(this.rxNormUrl, { params }).pipe(
      map((response) => {
        const medicamentos: any[] = [];
        if (response.drugGroup && response.drugGroup.conceptGroup) {
          response.drugGroup.conceptGroup.forEach(
            (group: { conceptProperties: any[] }) => {
              if (group.conceptProperties) {
                group.conceptProperties.forEach((concept: any) => {
                  medicamentos.push(concept.name);
                });
              }
            }
          );
        }
        return medicamentos;
      }),
      catchError((error) => {
        console.error('Error al buscar medicamentos en RxNorm:', error);
        return of([]);
      })
    );
  }

  crearConsulta(
    citaId: number,
    userId: number,
    horaInicio: string
  ): Observable<any> {
    const url = `${this.baseUrl}/auth/consultas/create`;
    const params = {
      citaId: citaId.toString(),
      userId: userId.toString(),
      horaInicio: horaInicio,
    };
    return this.http.post(url, params);
  }

  // Finalizar consulta
  finalizarConsulta(
    consultaId: number,
    motivoConsulta: string,
    horaFin: string
  ): Observable<any> {
    const url = `${this.baseUrl}/auth/consultas/finalizar/${consultaId}`;
    const params = { motivoConsulta, horaFin };
    return this.http.put(url, params);
  }

  guardarDiagnostico(diagnosticoData: any): Observable<any> {
    console.log(diagnosticoData);
    const url = `${this.baseUrl}/auth/diagnosticos/guardar`;
    return this.http.post(url, diagnosticoData);
  }

  // Obtener diagnóstico por consulta ID
  getDiagnosticoByConsultaId(consultaId: number): Observable<any> {
    const url = `${this.baseUrl}/auth/diagnosticos/consulta/${consultaId}`;
    return this.http.get(url);
  }

  // Actualizar diagnóstico
  actualizarDiagnostico(id: number, diagnosticoData: any): Observable<any> {
    console.log(diagnosticoData);
    console.log(id);
    const url = `${this.baseUrl}/auth/diagnosticos/actualizar/${id}`;
    return this.http.put(url, diagnosticoData);
  }

  guardarReceta(recetaData: any): Observable<any> {
    console.log(recetaData);
    return this.http.post(`${this.baseUrl}/auth/recetas/guardar`, recetaData);
  }

  obtenerRecetasPorConsulta(consultaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/auth/recetas/consulta/${consultaId}`);
  }

  actualizarReceta(id: number, recetaData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/auth/recetas/actualizar/${id}`, recetaData);
  }

  
}
