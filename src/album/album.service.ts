import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AlbumService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): Album[] {
    return this.db.albums;
  }

  findOne(id: string): Album {
    const album = this.db.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    const album: Album = {
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId ?? null,
    };
    this.db.albums.push(album);
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const album = this.db.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId ?? null;
    return album;
  }

  remove(id: string): void {
    const index = this.db.albums.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException('Album not found');
    }
    this.db.albums.splice(index, 1);

    // Set albumId to null in tracks
    this.db.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
    // Remove from favorites
    const favIndex = this.db.favorites.albums.indexOf(id);
    if (favIndex !== -1) {
      this.db.favorites.albums.splice(favIndex, 1);
    }
  }
}
