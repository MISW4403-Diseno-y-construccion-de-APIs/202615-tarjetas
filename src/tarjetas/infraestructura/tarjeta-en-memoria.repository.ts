import { Injectable } from '@nestjs/common';
import { Identificador } from '../../compartido/dominio/identificador';
import { NumeroTarjeta } from '../dominio/numero-tarjeta';
import { EstadoTarjeta } from '../dominio/estado-tarjeta';
import { Tarjeta } from '../dominio/tarjeta';
import { TarjetaRepositoryPort } from '../aplicacion/puertos';

interface FilaTarjeta {
  id: string;
  pan: string;
  titularId: string;
  titularNombre: string;
  estado: EstadoTarjeta;
  expedidaEn: string;
}

@Injectable()
export class TarjetaEnMemoriaRepository implements TarjetaRepositoryPort {
  private readonly datos = new Map<string, FilaTarjeta>();

  async guardar(tarjeta: Tarjeta): Promise<void> {
    const d = tarjeta.aDatos();
    this.datos.set(d.id, {
      id: d.id,
      pan: tarjeta.numeroParaPersistencia().aPersistencia(),
      titularId: d.titularId,
      titularNombre: d.titularNombre,
      estado: d.estado,
      expedidaEn: d.expedidaEn.toISOString(),
    });
  }

  async porId(id: Identificador): Promise<Tarjeta | null> {
    const fila = this.datos.get(id.valor);
    return fila ? this.aDominio(fila) : null;
  }

  async listar(): Promise<Tarjeta[]> {
    return [...this.datos.values()].map((f) => this.aDominio(f));
  }

  private aDominio(fila: FilaTarjeta): Tarjeta {
    return Tarjeta.rehidratar({
      id: Identificador.desde(fila.id),
      numero: NumeroTarjeta.desde(fila.pan),
      titularId: Identificador.desde(fila.titularId),
      titularNombre: fila.titularNombre,
      estado: fila.estado,
      expedidaEn: new Date(fila.expedidaEn),
    });
  }
}
