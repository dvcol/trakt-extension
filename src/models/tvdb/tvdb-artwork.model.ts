import type { Entity, EntityTypes, Extended, Short, TvdbTagOption } from '~/models/tvdb/tvdb-entity.model';
import type { RequireAtLeastOne } from '~/utils/typescript.utils';

export type TvdbArtworkShort = {
  id: number;
  /** http link to image file (e.g. https://artworks.thetvdb.com/banners/posters/7number327-1.jpg) */
  image: string;
  /** http link to image file (e.g. https://artworks.thetvdb.com/banners/posters/7number327-1_t.jpg) */
  thumbnail: string;
  language: string;
  type: number;
  score: number;
  width: number;
  height: number;
  includesText: boolean;
};

export type TvdbArtworkItem = RequireAtLeastOne<{
  episodeId: number;
  movieId: number;
  networkId: number;
  peopleId: number;
  seasonId: number;
  seriesId: number;
  seriesPeopleId: number;
}>;

export type TvdbArtworkExtended = TvdbArtworkShort &
  TvdbArtworkItem & {
    status: Entity;
    tagOptions: TvdbTagOption[];
    thumbnailHeight: number;
    thumbnailWidth: number;
    updatedAt: number;
  };

export type TvdbArtwork<T extends EntityTypes = Short> = T extends Short
  ? TvdbArtworkShort
  : T extends Extended
    ? TvdbArtworkExtended
    : TvdbArtworkShort | TvdbArtworkExtended;

export type TvdbArtworkType = {
  id: number;
  name: string;
  recordType: string;
  slug: string;
  imageFormat: string;
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
};
