export type ImageResolution = 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault';

export type YoutubePlayerProps = {
  announce?: string;
  id: string;
  title: string;
  activatedClass?: string;
  adNetwork?: boolean;
  iframeClass?: string;
  cookie?: boolean;
  /** @see [player-parameters]{@link https://developers.google.com/youtube/player_parameters#Parameters} */
  params?: string;
  playerClass?: string;
  playlist?: boolean;
  playlistCoverId?: string;
  poster?: ImageResolution;
  wrapperClass?: string;
  muted?: boolean;
  thumbnail?: string;
  webp?: boolean;
  rel?: 'prefetch' | 'preload';
  aspectHeight?: number;
  aspectWidth?: number;
};
