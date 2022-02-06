import { PostResult } from '@notion-stuff/v4-types';

function getPropertyByName(page: PostResult, propertyName: string) {
  if (!page) {
    throw new Error('No page given');
  }
  if (typeof page !== 'object' || page.object !== 'page') {
    throw new Error('Incorrect object given');
  }
  if (!(propertyName in page.properties)) {
    throw new Error(`No property ${propertyName} found`);
  }

  const propertyObject = page.properties[propertyName];
  const propertyType = propertyObject.type;
  const propertyValue = propertyObject[propertyType];
  if (!propertyValue) {
    throw new Error(`Property ${propertyName} is null`);
  }

  return typeof propertyValue === 'object' && propertyValue.length
    ? getPropertyUnknownType(propertyValue[0])
    : getPropertyUnknownType(propertyValue);
}

function getPropertyUnknownType(property: {
  type: 'text';
  plain_text: 'string';
}): string {
  switch (property.type) {
    case 'text':
      return property.plain_text;
    default:
      console.warn('Property of unknown type tried to be accessed');
      return '';
  }
}

export { getPropertyByName };
