const { notion } = require('./index');

async function getPages({
  databaseId,
  sorts = [{ property: 'title', direction: 'ascending' }],
  pagesResults = [],
  cursor = null,
  getAll = true,
  modifier = null,
}) {
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts,
    ...(Boolean(cursor) && { start_cursor: cursor }),
  });

  if (Boolean(modifier)) {
    response.results.reduce((acc, current) => {
      acc.push(modifier(current));
      return acc;
    }, pagesResults);
  } else {
    pagesResults.push(...response.results);
  }

  if (getAll && response.has_more) {
    return await getPages({
      databaseId,
      sorts,
      pagesResults,
      cursor: response.next_cursor,
      getAll,
      modifier,
    });
  }
  return pagesResults;
}

module.exports = { getPages };
