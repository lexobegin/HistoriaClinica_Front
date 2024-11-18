export interface Cita {
    id: number;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    estado: string;
    precio: number;
    user: {
      id: number;
      username: string;
      ci: string;
      nombre: string;
      apellido_paterno: string;
      apellido_materno: string;
      telefono: string;
    };
    medico: {
      id: number;
      user: {
        id: number;
        nombre: string;
        apellido_paterno: string;
        apellido_materno: string;
      };
    };

    bloqueMedico: {
      id: number;
      horaInicio: string;
      horaFin: string;
      disponibilidad: boolean;
      // Otros campos si es necesario
    };
  }
  