import { Module } from '@nestjs/common';
import { TarjetasModule } from './tarjetas/tarjetas.module';
import { EnviosModule } from './envios/envios.module';
import { SaludController } from './salud.controller';

@Module({
  imports: [TarjetasModule, EnviosModule],
  controllers: [SaludController],
})
export class AppModule {}
