export interface BloqueMedico {
  id?: number;
  horaInicio: string;
  horaFin: string;
  disponibilidad: boolean;
  citaId?: number | null; // Acepta null como valor
}


export interface Medico {
  id: number;
  nombre: string;
  // Otros campos según tu entidad Medico
}

export interface Servicio {
  id: number;
  nombre: string;
  // Otros campos según tu entidad Medico
}

export interface HorarioMedico {
  id?: number;
  fecha: string; // Formato "YYYY-MM-DD"
  horaInicio: string; // Formato "HH:mm"
  horaFin: string; // Formato "HH:mm"
  cupoTotal: number;
  cupoDisponible: number;
  medico: Medico;
  servicio: Servicio;
  bloques: BloqueMedico[];
}

// Definir la interfaz para la actualización de horario
export interface HorarioMedicoUpdate {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  cupoTotal: number;
  cupoDisponible: number;
  medico: { id: number };
  servicio: { id: number };
  bloques: {
    id?: number;
    horaInicio: string;
    horaFin: string;
    disponibilidad: boolean;
  }[];
}
