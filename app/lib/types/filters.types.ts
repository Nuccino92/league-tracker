export type BaseFilter = {
  query?: string;
  page?: number;
  limit?: number;
  sort?: string;
};

export type Filter<T extends object = {}> = BaseFilter & T;

/** example use:
 *  type TeamFilter = Filter<{ leagueId?: number; active?: boolean }>;
 */

export type SearchParamScope = Array<'season' | 'search' | 'team' | 'page'>;
