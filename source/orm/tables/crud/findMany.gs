function findManyBy_(key, value) {
  try {
    if (key == undefined) {
      throw new Error(ENV.MESSAGES.NO_KEY_MANY);
    }
    const objectifiedData = objectify_(this);
    let data = objectifiedData.filter(el => el[key] == value);
    data.forEach(el => {
      el._save = save_.bind(null, this, el);
      el._delete = delete_.bind(null, this, el);
    });
    data = { data: data };
    data._save = saveMany_.bind(null, this, data.data);
    data._delete = deleteMany_.bind(null, this, data.data);
    return data;
  } catch (e) {
    throw new Error(e.stack);
  }
}

function findManyByQuery_(query) {
  try {
    if (query == undefined) {
      throw new Error(ENV.MESSAGES.NO_QUERY_MANY);
    }
    const objectifiedData = objectify_(this);
    query = query.replaceAll("{}.", "el.");
    const filterFunc = eval(`el => ${query}`);
    let data = objectifiedData.filter(filterFunc);
    data.forEach(el => {
      el._save = save_.bind(null, this, el);
      el._delete = delete_.bind(null, this, el);
    });
    data = { data: data };
    data._save = saveMany_.bind(null, this, data.data);
    data._delete = deleteMany_.bind(null, this, data.data);
    return data;
  } catch (e) {
    throw new Error(e.stack);
  }
}

function all_() {
  try {
    let data = objectify_(this);
    data.forEach(el => {
      el._save = save_.bind(null, this, el);
      el._delete = delete_.bind(null, this, el);
    });
    data = { data: data };
    data._save = saveMany_.bind(null, this, data.data);
    data._delete = function () {
      this.getRange(2, 1, this.getLastRow() - 1, this.getLastColumn()).clearContent();
      return ENV.MESSAGES.DELETED;
    }.bind(this, data.data);
    return data;
  } catch (e) {
    throw new Error(e.stack);
  }
}
