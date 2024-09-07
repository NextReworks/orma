function firstBy_(key, value) {
  try {
    if (key == undefined) {
      throw new Error(ENV.MESSAGES.NO_KEY);
    }
    const objectifiedData = objectify_(this);
    const data = objectifiedData.find(el => el[key] === value);
    if (data != null) {
      data._save = save_.bind(null, this, data);
      data._delete = delete_.bind(null, this, data);
      return data;
    } else {
      throw new Error(ENV.MESSAGES.NO_INSTANCE_GIVEN_COLUMN.replace(ENV.PLACEHOLDERS.ONE, value).replace(ENV.PLACEHOLDERS.TWO, key));
    }
  } catch (e) {
    throw new Error(e.stack);
  }
}

function find_(id) {
  try {
    if (id == undefined) {
      throw new Error(ENV.MESSAGES.NO_ID);
    }
    const objectifiedData = objectify_(this);
    const data = objectifiedData.find(el => el.id == id);
    if (data != null) {
      data._save = save_.bind(null, this, data);
      data._delete = delete_.bind(null, this, data);
      return data;
    } else {
      throw new Error(ENV.MESSAGES.NO_INSTANCE_GIVEN_ID.replace(ENV.PLACEHOLDERS.ONE, id));
    }
  } catch (e) {
    throw new Error(e.stack);
  }
}

function firstByQuery_(query) {
  try {
    if (query == undefined) {
      throw new Error(ENV.MESSAGES.NO_QUERY);
    }
    const objectifiedData = objectify_(this);
    query = query.replaceAll("{}.", "el.");
    const filterFunc = eval(`el => ${query}`);
    const data = objectifiedData.find(filterFunc);
    if (data != null) {
      data._save = save_.bind(null, this, data);
      data._delete = delete_.bind(null, this, data);
      return data;
    } else {
      throw new Error(ENV.MESSAGES.NO_INSTANCE_GIVEN_QUERY.replace(ENV.PLACEHOLDERS.ONE, query));
    }
  } catch (e) {
    throw new Error(e.stack);
  }
}
