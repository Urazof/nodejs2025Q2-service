import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Album } from '../../album/entities/album.entity';

@Entity('favorite_albums')
export class FavoriteAlbum {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Album, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'albumId' })
  album: Album;

  @CreateDateColumn()
  createdAt: Date;
}
