import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Identificador } from '../dominio/identificador';
import { GeneradorIdPort } from '../aplicacion/puertos';

@Injectable()
export class GeneradorIdUuidAdapter implements GeneradorIdPort {
  siguiente(): Identificador {
    return Identificador.desde(randomUUID());
  }
}
