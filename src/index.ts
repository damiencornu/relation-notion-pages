require('dotenv').config();
import { PostResult, PropertyValueMap } from '@notion-stuff/v4-types';
import { notion } from './shared';
import { getPages } from './shared/database';
import { getPropertyByName } from './shared/properties';

const authorsDbId = process.env.NOTION_AUTHORS_DATABASE_ID;
const titlesDbId = process.env.NOTION_TITLES_DATABASE_ID;

async function getAuthors(): Promise<PostResult[]> {
  try {
    const authors = await getPages({
      databaseId: authorsDbId,
    });
    return authors;
  } catch (error) {
    console.error('Error', error);
    return [];
  }
}

async function getTitles(): Promise<PostResult[]> {
  try {
    const titles: PostResult[] = await getPages({
      databaseId: titlesDbId,
    });
    return titles;
  } catch (error) {
    console.error('Error', error);
    return [];
  }
}

async function linkTables({
  authors,
  titles,
}: {
  authors: PostResult[];
  titles: PostResult[];
}) {
  console.log('Link Tables', titles.length, 'elements');
  titles.forEach(async (title) => {
    const titleAuthors = getPropertyByName(title, 'Auteurs')?.split(',');
    const authorsProperties = authors.map((author) => ({
      id: author.id,
      name: getPropertyByName(author, 'Nom'),
    }));
    const titleAuthorsIds = titleAuthors
      ?.map((author: string) => {
        const id = authorsProperties.find((a) => a.name === author)?.id;
        return id
          ? {
              id,
            }
          : null;
      })
      .filter((a: { id: string } | undefined) => a);

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
