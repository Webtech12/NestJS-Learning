import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { Song } from './songs/entities/song.entity';
import { Artist } from './artists/entities/artist.entity';
import { User } from './users/entities/user.entity';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.POSTGRES_NAME,
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      entities: [Song, Artist, User],
      synchronize: true,
    }),
    SongsModule,
    PlaylistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    console.log('dbName ', dataSource.driver.database);
  }
}
