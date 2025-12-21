import { request } from './lib';
import { StatusCodes } from 'http-status-codes';
import { getTokenAndUserId, removeTokenUser } from './utils';
import {
  albumsRoutes,
  artistsRoutes,
  tracksRoutes,
  favoritesRoutes,
} from './endpoints';

const createAlbumDto = {
  name: 'TEST_ALBUM',
  year: 2022,
  artistId: null,
};

const createArtistDto = {
  name: 'TEST_artist',
  grammy: true,
};

const createTrackDto = {
  name: 'Test track',
  duration: 335,
  artistId: null,
  albumId: null,
};

describe('Favorites (e2e)', () => {
  const commonHeaders = { Accept: 'application/json' };
  let mockUserId: string | undefined;

  beforeAll(async () => {
    // Аутентификация теперь всегда требуется, так как JwtAuthGuard установлен глобально
    const result = await getTokenAndUserId(request);
    commonHeaders['Authorization'] = result.token;
    mockUserId = result.mockUserId;
  });

  afterAll(async () => {
    if (mockUserId) {
      await removeTokenUser(request, mockUserId, commonHeaders);
    }
  });

  it('should correctly get all favorites (empty initially)', async () => {
    const response = await request
      .get(favoritesRoutes.getAll)
      .set(commonHeaders)
      .expect(StatusCodes.OK);

    expect(response.body).toEqual({
      artists: [],
      albums: [],
      tracks: [],
    });
  });

  it('should add and remove artist from favorites', async () => {
    const artistRes = await request
      .post(artistsRoutes.create)
      .set(commonHeaders)
      .send(createArtistDto)
      .expect(StatusCodes.CREATED);
    const artistId = artistRes.body.id;

    await request
      .post(favoritesRoutes.artists(artistId))
      .set(commonHeaders)
      .expect(StatusCodes.CREATED);

    const favsRes = await request
      .get(favoritesRoutes.getAll)
      .set(commonHeaders)
      .expect(StatusCodes.OK);
    expect(favsRes.body.artists).toHaveLength(1);
    expect(favsRes.body.artists[0].id).toBe(artistId);

    await request
      .delete(favoritesRoutes.artists(artistId))
      .set(commonHeaders)
      .expect(StatusCodes.NO_CONTENT);

    const favsRes2 = await request
      .get(favoritesRoutes.getAll)
      .set(commonHeaders)
      .expect(StatusCodes.OK);
    expect(favsRes2.body.artists).toHaveLength(0);

    // Удаляем артиста после удаления из избранного
    await request
      .delete(artistsRoutes.delete(artistId))
      .set(commonHeaders)
      .expect(StatusCodes.NO_CONTENT);
  });

  it('should add and remove album from favorites', async () => {
    const albumRes = await request
      .post(albumsRoutes.create)
      .set(commonHeaders)
      .send(createAlbumDto)
      .expect(StatusCodes.CREATED);
    const albumId = albumRes.body.id;

    await request
      .post(favoritesRoutes.albums(albumId))
      .set(commonHeaders)
      .expect(StatusCodes.CREATED);

    const favsRes = await request
      .get(favoritesRoutes.getAll)
      .set(commonHeaders)
      .expect(StatusCodes.OK);
    expect(favsRes.body.albums).toHaveLength(1);
    expect(favsRes.body.albums[0].id).toBe(albumId);

    await request
      .delete(favoritesRoutes.albums(albumId))
      .set(commonHeaders)
      .expect(StatusCodes.NO_CONTENT);

    const favsRes2 = await request
      .get(favoritesRoutes.getAll)
      .set(commonHeaders)
      .expect(StatusCodes.OK);
    expect(favsRes2.body.albums).toHaveLength(0);

    // Удаляем альбом после удаления из избранного
    await request
      .delete(albumsRoutes.delete(albumId))
      .set(commonHeaders)
      .expect(StatusCodes.NO_CONTENT);
  });

  it('should add and remove track from favorites', async () => {
    const trackRes = await request
      .post(tracksRoutes.create)
      .set(commonHeaders)
      .send(createTrackDto)
      .expect(StatusCodes.CREATED);
    const trackId = trackRes.body.id;

    await request
      .post(favoritesRoutes.tracks(trackId))
      .set(commonHeaders)
      .expect(StatusCodes.CREATED);

    const favsRes = await request
      .get(favoritesRoutes.getAll)
      .set(commonHeaders)
      .expect(StatusCodes.OK);
    expect(favsRes.body.tracks).toHaveLength(1);
    expect(favsRes.body.tracks[0].id).toBe(trackId);

    await request
      .delete(favoritesRoutes.tracks(trackId))
      .set(commonHeaders)
      .expect(StatusCodes.NO_CONTENT);

    const favsRes2 = await request
      .get(favoritesRoutes.getAll)
      .set(commonHeaders)
      .expect(StatusCodes.OK);
    expect(favsRes2.body.tracks).toHaveLength(0);

    // Удаляем трек после удаления из избранного
    await request
      .delete(tracksRoutes.delete(trackId))
      .set(commonHeaders)
      .expect(StatusCodes.NO_CONTENT);
  });
});
