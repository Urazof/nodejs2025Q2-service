import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Artist } from '../../artist/entities/artist.entity';

@Entity('favorite_artists')
export class FavoriteArtist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Artist, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @CreateDateColumn({ select: false })
  createdAt: Date;
}
