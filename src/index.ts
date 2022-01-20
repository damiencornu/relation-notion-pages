require('dotenv').config();
import { notion } from './shared';
import { getPages } from './shared/database';
import { getPropertyByName } from './shared/properties';

const authorsDbId = process.env.NOTION_AUTHORS_DATABASE_ID;
const titlesDbId = process.env.NOTION_TITLES_DATABASE_ID;

async function getAuthors() {
  try {
    const authors = await getPages({
      databaseId: authorsDbId,
      modifier: (result) => ({
        id: result.id,
        name: getPropertyByName(result, 'Nom'),
      }),
    });
    return authors;
  } catch (error) {
    console.error('Error', error);
    return [];
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
    return [];
  }
}

async function linkTables({ authors, titles }) {
  console.log('Link Tables', titles.length, 'elements');
  titles.forEach(async (title) => {
    const titleAuthors = getPropertyByName(title, 'Auteurs')?.split(',');
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
    } else {
      console.log(`No author found for '${getPropertyByName(title, 'titre')}'`);
    }
  });
}

async function work() {
  const authors = await getAuthors();
  const titles = await getTitles();

  await linkTables({ authors, titles });
}

work();
