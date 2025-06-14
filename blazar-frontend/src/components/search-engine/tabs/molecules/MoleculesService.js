export const extractMoleculeInformation = (dataObject) => {
  let result = [];
  if (dataObject instanceof Array) {
    for (let i = 0; i < dataObject.length; i++) {
      result = extractMoleculeInformation(dataObject[i]);
      if (result) {
        break;
      }
    }
  } else {
    for (let prop in dataObject) {
      if (Object.keys(dataObject).indexOf('Information') !== -1) {
        return dataObject.Information;
      }

      if (
        dataObject[prop] instanceof Object ||
        dataObject[prop] instanceof Array
      ) {
        result = extractMoleculeInformation(dataObject[prop]);
        if (result) {
          break;
        }
      }
    }
  }
  return result;
};
