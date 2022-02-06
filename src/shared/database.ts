const { notion } = require('./index');
import { PostResult } from '@notion-stuff/v4-types';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

async function getPages({
  databaseId,
  sorts = [{ property: 'title', direction: 'ascending' }],
  pagesResults = [],
  cursor = null,
  getAll = true,
}: {
  databaseId: string;
  sorts?: [{ property: string; direction: 'ascending' | 'descending' }];
  pagesResults?: Array<any>;
  cursor?: string;
  getAll?: boolean;
}): Promise<PostResult[]> {
  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: databaseId,
    sorts,
    ...(Boolean(cursor) && { start_cursor: cursor }),
  });
  pagesResults.push(...response.results);

  if (getAll && response.has_more) {
    return await getPages({
      databaseId,
      sorts,
      pagesResults,
      cursor: response.next_cursor,
      getAll,
    });
  }
  return pagesResults;
}

export { getPages };
