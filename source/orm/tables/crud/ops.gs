// Funzione generica save_
function save_(context, data) {
  data = valid_(context, data);
  const { id } = data;
  const objectifiedData = objectify_(context);
  const index = objectifiedData.findIndex(el => el.id === id);
  const dataToPrint = arrayfyOne_(data, context._tableHeaders);
  context.getRange(index + 2, 1, 1, dataToPrint.length).setValues([dataToPrint]);
  return data;
}

// Funzione generica delete_
function delete_(context, data) {
  const { id } = data;
  const objectifiedData = objectify_(context);
  const index = objectifiedData.findIndex(el => el.id === id);
  context.deleteRow(index + 2);
  Object.keys(data).forEach(key => delete data[key]);
  return ENV.MESSAGES.DELETED;
}

// Funzione generica saveMany_
function saveMany_(context, data) {
  data = validMultiple_(context, data);
  data.forEach(el => save_(context, el));
  return data;
}

// Funzione generica deleteMany_
function deleteMany_(context, data) {
  const ids = data.map(el => {
    const { id } = el;
    const objectifiedData = objectify_(context);
    return objectifiedData.findIndex(el => el.id === id);
  });
  ids.sort((a, b) => b - a).forEach(index => context.deleteRow(index + 2));
  return ENV.MESSAGES.DELETED;
}
