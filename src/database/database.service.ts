import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { Favorites } from '../favorites/entities/favorites.entity';

@Injectable()
export class DatabaseService {
  users: User[] = [];
  artists: Artist[] = [];
  albums: Album[] = [];
  tracks: Track[] = [];
  favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
}
