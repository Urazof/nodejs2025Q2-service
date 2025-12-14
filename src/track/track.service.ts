import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TrackService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): Track[] {
    return this.db.tracks;
  }

  findOne(id: string): Track {
    const track = this.db.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  create(createTrackDto: CreateTrackDto): Track {
    const track: Track = {
      id: randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId ?? null,
      albumId: createTrackDto.albumId ?? null,
      duration: createTrackDto.duration,
    };
    this.db.tracks.push(track);
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const track = this.db.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    track.name = updateTrackDto.name;
    track.artistId = updateTrackDto.artistId ?? null;
    track.albumId = updateTrackDto.albumId ?? null;
    track.duration = updateTrackDto.duration;
    return track;
  }

  remove(id: string): void {
    const index = this.db.tracks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException('Track not found');
    }
    this.db.tracks.splice(index, 1);

    // Remove from favorites
    const favIndex = this.db.favorites.tracks.indexOf(id);
    if (favIndex !== -1) {
      this.db.favorites.tracks.splice(favIndex, 1);
    }
  }
}
