import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column({ unique: true })
  login: string;

  @Column()
  @Exclude() // Исключаем пароль из сериализации в JSON для безопасности
  password: string;

  @Column({ default: 1 })
  version: number; // integer number, increments on update

  @Column({
    type: 'bigint',
    transformer: {
      to: (value: number) => value || Date.now(),
      from: (value: string) => parseInt(value, 10),
    },
  })
  createdAt: number; // timestamp of creation

  @Column({
    type: 'bigint',
    transformer: {
      to: (value: number) => value || Date.now(),
      from: (value: string) => parseInt(value, 10),
    },
  })
  updatedAt: number; // timestamp of last update
}
