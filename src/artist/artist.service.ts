import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ArtistService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): Artist[] {
    return this.db.artists;
  }

  findOne(id: string): Artist {
    const artist = this.db.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const artist: Artist = {
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.db.artists.push(artist);
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artist = this.db.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;
    return artist;
  }

  remove(id: string): void {
    const index = this.db.artists.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException('Artist not found');
    }
    this.db.artists.splice(index, 1);

    // Set artistId to null in albums and tracks
    this.db.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
    this.db.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
    // Remove from favorites
    const favIndex = this.db.favorites.artists.indexOf(id);
    if (favIndex !== -1) {
      this.db.favorites.artists.splice(favIndex, 1);
    }
  }
}
