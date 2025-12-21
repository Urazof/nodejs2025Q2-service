import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../user/entities/user.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { FavoriteArtist } from '../favorites/entities/favorite-artist.entity';
import { FavoriteAlbum } from '../favorites/entities/favorite-album.entity';
import { FavoriteTrack } from '../favorites/entities/favorite-track.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || '127.0.0.1',
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
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false, // Отключаем автосинхронизацию, используем миграции
  logging: false,
});
