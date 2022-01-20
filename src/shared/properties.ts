function getPropertyByName(page, propertyName) {
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

function getPropertyUnknownType(property) {
  switch (property.type) {
    case 'text':
      return property.plain_text;
  }
}

export { getPropertyByName };
