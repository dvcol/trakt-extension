import type { TraktUser } from '~/models/trakt-user.model';

export type TraktList = {
  name: string;
  description: string;
  privacy: string;
  share_link: string;
  type: string;
  display_numbers: boolean;
  allow_comments: boolean;
  sort_by: string;
  sort_how: string;
  created_at: string;
  updated_at: string;
  item_count: number;
  comment_count: number;
  likes: number;
  ids: {
    trakt: number;
    slug: string;
  };
  user: TraktUser;
};
