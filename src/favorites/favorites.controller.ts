import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    this.favoritesService.addArtist(id);
    return { message: 'Artist added to favorites' };
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    this.favoritesService.removeArtist(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    this.favoritesService.addAlbum(id);
    return { message: 'Album added to favorites' };
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    this.favoritesService.removeAlbum(id);
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    this.favoritesService.addTrack(id);
    return { message: 'Track added to favorites' };
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    this.favoritesService.removeTrack(id);
  }
}
