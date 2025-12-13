import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoritesResponse } from './entities/favorites-response.entity';
import { FavoriteArtist } from './entities/favorite-artist.entity';
import { FavoriteAlbum } from './entities/favorite-album.entity';
import { FavoriteTrack } from './entities/favorite-track.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteArtist)
    private readonly favoriteArtistRepository: Repository<FavoriteArtist>,
    @InjectRepository(FavoriteAlbum)
    private readonly favoriteAlbumRepository: Repository<FavoriteAlbum>,
    @InjectRepository(FavoriteTrack)
    private readonly favoriteTrackRepository: Repository<FavoriteTrack>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async findAll(): Promise<FavoritesResponse> {
    // Используем eager: true в Entity, поэтому связанные объекты загружаются автоматически
    const favoriteArtists = await this.favoriteArtistRepository.find();
    const favoriteAlbums = await this.favoriteAlbumRepository.find();
    const favoriteTracks = await this.favoriteTrackRepository.find();

    return {
      artists: favoriteArtists.map((fa) => fa.artist),
      albums: favoriteAlbums.map((fa) => fa.album),
      tracks: favoriteTracks.map((ft) => ft.track),
    };
  }

  async addArtist(id: string): Promise<void> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }

    // Проверяем, не добавлен ли уже
    const existing = await this.favoriteArtistRepository.findOne({
      where: { artist: { id } },
    });

    if (!existing) {
      const favoriteArtist = this.favoriteArtistRepository.create({ artist });
      await this.favoriteArtistRepository.save(favoriteArtist);
    }
  }

  async removeArtist(id: string): Promise<void> {
    const favoriteArtist = await this.favoriteArtistRepository.findOne({
      where: { artist: { id } },
    });

    if (!favoriteArtist) {
      throw new NotFoundException('Artist is not in favorites');
    }

    await this.favoriteArtistRepository.remove(favoriteArtist);
  }

  async addAlbum(id: string): Promise<void> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }

    const existing = await this.favoriteAlbumRepository.findOne({
      where: { album: { id } },
    });

    if (!existing) {
      const favoriteAlbum = this.favoriteAlbumRepository.create({ album });
      await this.favoriteAlbumRepository.save(favoriteAlbum);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    const favoriteAlbum = await this.favoriteAlbumRepository.findOne({
      where: { album: { id } },
    });

    if (!favoriteAlbum) {
      throw new NotFoundException('Album is not in favorites');
    }

    await this.favoriteAlbumRepository.remove(favoriteAlbum);
  }

  async addTrack(id: string): Promise<void> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }

    const existing = await this.favoriteTrackRepository.findOne({
      where: { track: { id } },
    });

    if (!existing) {
      const favoriteTrack = this.favoriteTrackRepository.create({ track });
      await this.favoriteTrackRepository.save(favoriteTrack);
    }
  }

  async removeTrack(id: string): Promise<void> {
    const favoriteTrack = await this.favoriteTrackRepository.findOne({
      where: { track: { id } },
    });

    if (!favoriteTrack) {
      throw new NotFoundException('Track is not in favorites');
    }

    await this.favoriteTrackRepository.remove(favoriteTrack);
  }
}
