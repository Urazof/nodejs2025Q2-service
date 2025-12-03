import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesResponse } from './entities/favorites-response.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): FavoritesResponse {
    const artists = this.db.favorites.artists
      .map((id) => {
        return this.db.artists.find((a) => a.id === id);
      })
      .filter((artist) => artist !== undefined);

    const albums = this.db.favorites.albums
      .map((id) => {
        return this.db.albums.find((a) => a.id === id);
      })
      .filter((album) => album !== undefined);

    const tracks = this.db.favorites.tracks
      .map((id) => {
        return this.db.tracks.find((t) => t.id === id);
      })
      .filter((track) => track !== undefined);

    return { artists, albums, tracks };
  }

  addArtist(id: string): void {
    const artist = this.db.artists.find((a) => a.id === id);
    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }
    if (!this.db.favorites.artists.includes(id)) {
      this.db.favorites.artists.push(id);
    }
  }

  removeArtist(id: string): void {
    const index = this.db.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist is not in favorites');
    }
    this.db.favorites.artists.splice(index, 1);
  }

  addAlbum(id: string): void {
    const album = this.db.albums.find((a) => a.id === id);
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }
    if (!this.db.favorites.albums.includes(id)) {
      this.db.favorites.albums.push(id);
    }
  }

  removeAlbum(id: string): void {
    const index = this.db.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album is not in favorites');
    }
    this.db.favorites.albums.splice(index, 1);
  }

  addTrack(id: string): void {
    const track = this.db.tracks.find((t) => t.id === id);
    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }
    if (!this.db.favorites.tracks.includes(id)) {
      this.db.favorites.tracks.push(id);
    }
  }

  removeTrack(id: string): void {
    const index = this.db.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track is not in favorites');
    }
    this.db.favorites.tracks.splice(index, 1);
  }
}
