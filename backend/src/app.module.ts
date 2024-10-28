import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuperheroesModule } from './superheroes/superheroes.module';
import { DatabaseModule } from './database/database.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [SuperheroesModule, DatabaseModule, CloudinaryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
