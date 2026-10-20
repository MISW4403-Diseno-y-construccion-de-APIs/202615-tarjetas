import { Tarjeta } from '../dominio/tarjeta';

export function presentarTarjeta(tarjeta: Tarjeta) {
  const d = tarjeta.aDatos();
  return {
    id: d.id,

    pan: tarjeta.numeroParaPersistencia().aPersistencia(),
    numero_enmascarado: d.numeroEnmascarado,
    bin: d.bin,
    ultimos4: d.ultimos4,
    titular_id: d.titularId,
    titular_nombre: d.titularNombre,
    estado: d.estado,
    expedida_en: d.expedidaEn,
  };
}
