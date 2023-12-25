export const Client = {
  ID: '4f2745eb6a58949bd35f4948b70d0dd7184462841052fa11f24d85edc1256a22',
  Secret: '322d3d1a6d6d9214a1fc120903c8722b266e7643bd708e437ddbb68f5c737fa2',
} as const;

export const Config = {
  UserAgent: `${import.meta.env.PKG_NAME}/${import.meta.env.PKG_VERSION}`,
  TraktEndpoint: 'https://api.trakt.tv',
  RedirectionUrl: 'urn:ietf:wg:oauth:2.0:oob',
};
