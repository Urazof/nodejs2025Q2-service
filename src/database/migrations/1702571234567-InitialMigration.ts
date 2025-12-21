import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1702571234567 implements MigrationInterface {
  name = 'InitialMigration1702571234567';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Включение расширения для UUID
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Создание таблицы users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "login" character varying NOT NULL,
        "password" character varying NOT NULL,
        "version" integer NOT NULL DEFAULT 1,
        "createdAt" bigint NOT NULL,
        "updatedAt" bigint NOT NULL,
        CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Создание таблицы artists
    await queryRunner.query(`
      CREATE TABLE "artists" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "grammy" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_artists" PRIMARY KEY ("id")
      )
    `);

    // Создание таблицы albums
    await queryRunner.query(`
      CREATE TABLE "albums" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "year" integer NOT NULL,
        "artistId" uuid,
        CONSTRAINT "PK_albums" PRIMARY KEY ("id"),
        CONSTRAINT "FK_albums_artist" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL
      )
    `);

    // Создание таблицы tracks
    await queryRunner.query(`
      CREATE TABLE "tracks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "artistId" uuid,
        "albumId" uuid,
        "duration" integer NOT NULL,
        CONSTRAINT "PK_tracks" PRIMARY KEY ("id"),
        CONSTRAINT "FK_tracks_artist" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_tracks_album" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL
      )
    `);

    // Создание таблицы favorite_artists
    await queryRunner.query(`
      CREATE TABLE "favorite_artists" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "artistId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_favorite_artists" PRIMARY KEY ("id"),
        CONSTRAINT "FK_favorite_artists" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE
      )
    `);

    // Создание таблицы favorite_albums
    await queryRunner.query(`
      CREATE TABLE "favorite_albums" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "albumId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_favorite_albums" PRIMARY KEY ("id"),
        CONSTRAINT "FK_favorite_albums" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE
      )
    `);

    // Создание таблицы favorite_tracks
    await queryRunner.query(`
      CREATE TABLE "favorite_tracks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "trackId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_favorite_tracks" PRIMARY KEY ("id"),
        CONSTRAINT "FK_favorite_tracks" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "favorite_tracks"`);
    await queryRunner.query(`DROP TABLE "favorite_albums"`);
    await queryRunner.query(`DROP TABLE "favorite_artists"`);
    await queryRunner.query(`DROP TABLE "tracks"`);
    await queryRunner.query(`DROP TABLE "albums"`);
    await queryRunner.query(`DROP TABLE "artists"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
  }
}
