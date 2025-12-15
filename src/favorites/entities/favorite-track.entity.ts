import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Track } from '../../track/entities/track.entity';

@Entity('favorite_tracks')
export class FavoriteTrack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Track, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'trackId' })
  track: Track;

  @CreateDateColumn()
  createdAt: Date;
}
