import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../album/entities/album.entity';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column()
  name: string;

  @Column({ nullable: true, type: 'uuid' })
  artistId: string | null; // refers to Artist

  @Column({ nullable: true, type: 'uuid' })
  albumId: string | null; // refers to Album

  @Column()
  duration: number; // integer number (в секундах)

  @ManyToOne(() => Artist, (artist) => artist.tracks, {
    onDelete: 'SET NULL', // При удалении артиста, artistId станет null
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @ManyToOne(() => Album, (album) => album.tracks, {
    onDelete: 'SET NULL', // При удалении альбома, albumId станет null
  })
  @JoinColumn({ name: 'albumId' })
  album: Album;
}
