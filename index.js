require('dotenv').config();
const { notion } = require('./shared');
const { getPages } = require('./shared/database');

const authorsDbId = process.env.NOTION_AUTHORS_DATABASE_ID;
const titlesDbId = process.env.NOTION_TITLES_DATABASE_ID;

async function getAuthors() {
  try {
    const authors = await getPages({
      databaseId: authorsDbId,
      modifier: (result) => ({
        id: result.id,
        name: result.properties.Nom.title[0].plain_text,
      }),
    });
    return authors;
  } catch (error) {
    console.error('Error', error);
  }
}

async function getTitles() {
  try {
    const titles = await getPages({
      databaseId: titlesDbId,
    });
    return titles;
  } catch (error) {
    console.error('Error', error);
  }
}

async function linkTables({ authors, titles }) {
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
  const authors = await getAuthors();
  const titles = await getTitles();

  await linkTables({ authors, titles });
}

work();
