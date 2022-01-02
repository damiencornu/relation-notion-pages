require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_KEY });

const authorsDbId = process.env.NOTION_AUTHORS_DATABASE_ID;
const titlesDbId = process.env.NOTION_TITLES_DATABASE_ID;

const authors = [];
const titles = [];

async function getAuthors(cursor) {
  console.log('Get Authors', { cursor });
  try {
    const response = await notion.databases.query({
      database_id: authorsDbId,
      sorts: [{ property: 'title', direction: 'ascending' }],
      ...(Boolean(cursor) && { start_cursor: cursor }),
    });

    response.results.reduce((acc, current) => {
      acc.push({
        id: current.id,
        name: current.properties.Nom.title[0].plain_text,
      });
      return acc;
    }, authors);
    console.log(authors.length, response.has_more);

    if (response.has_more) {
      await getAuthors(response.next_cursor);
    } else {
      console.log(`Finished with ${authors.length} response`);
    }
  } catch (error) {
    console.error('Error', error);
  }
}

async function getTitles(cursor) {
  console.log('Get titles', { cursor });
  try {
    const response = await notion.databases.query({
      database_id: titlesDbId,
      sorts: [{ property: 'title', direction: 'ascending' }],
      ...(Boolean(cursor) && { start_cursor: cursor }),
    });

    titles.push(...response.results);

    console.log(titles.length, response.has_more);
    if (response.has_more) {
      await getTitles(response.next_cursor);
    } else {
      console.log(`Finished with ${titles.length} response`);
    }
  } catch (error) {
    console.error('Error', error);
  }
}

async function linkTables() {
  console.log('Link Tables', titles.length, 'elements');
  titles.forEach(async (title) => {
    const titleAuthors =
      title.properties.Auteurs.rich_text[0]?.plain_text?.split(',');
    console.log(titleAuthors);
    const titleAuthorsIds = titleAuthors
      ?.map((author) => {
        const id = authors.find((a) => a.name === author)?.id;
        return id
          ? {
              id,
            }
          : null;
      })
      .filter((a) => a);

    if (Boolean(titleAuthorsIds)) {
      try {
        await notion.pages.update({
          page_id: title.id,
          properties: {
            'Auteurs linked': {
              relation: titleAuthorsIds,
            },
          },
        });
      } catch (error) {
        console.log(`Error updating title ${title.id}`);
        console.error(error);
      }
    }
  });
}

async function work() {
  await getAuthors();

  await getTitles();

  await linkTables();
}

work();
