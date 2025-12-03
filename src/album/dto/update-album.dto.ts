import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsOptional()
  @IsString()
  artistId: string | null;
}
