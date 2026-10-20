export interface CrearEnvioBody {
  tarjeta_id?: string;
  direccion?: {
    calle?: string;
    ciudad?: string;
    pais?: string;
    codigo_postal?: string;
  };
}

export interface SeguimientoBody {
  evento?: string;
}
