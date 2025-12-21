import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavoritesModule } from './favorites/favorites.module';
import { User } from './user/entities/user.entity';
import { Artist } from './artist/entities/artist.entity';
import { Album } from './album/entities/album.entity';
import { Track } from './track/entities/track.entity';
import { FavoriteArtist } from './favorites/entities/favorite-artist.entity';
import { FavoriteAlbum } from './favorites/entities/favorite-album.entity';
import { FavoriteTrack } from './favorites/entities/favorite-track.entity';

@Module({
  imports: [
    // Загрузка переменных окружения из .env файла
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Настройка TypeORM для подключения к PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'home_library',
      entities: [
        User,
        Artist,
        Album,
        Track,
        FavoriteArtist,
        FavoriteAlbum,
        FavoriteTrack,
      ],
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true', // Controlled by env var
      logging: false,
    }),
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
