function create_(object) {

  if (!isObject_(object)) {
    throw new Error(ENV.MESSAGES.NO_OBJECT)
  }
  try {


    object = valid_(this, object);
    const headers = this._tableHeaders;
    const data = arrayfyOne_(object, headers);
    this.appendRow(data.flat());
    object._save = save_.bind(null, this, object);
    object._delete = delete_.bind(null, this, object);
    return object;
  } catch (e) {
    throw new Error(e.stack);
  }
}

function createMany_(arrayOfObject) {
  try {
    if (!isArray_(arrayOfObject)) {
      throw new Error(ENV.MESSAGES.NO_ARRAY)
    }
    if (arrayOfObject.length === 0) {
      throw new Error(ENV.MESSAGES.NO_INSTANCE_TO_CREATE);
    }
    arrayofObject = validMultiple_(this, arrayOfObject);
    const headers = this._tableHeaders;
    const data = arrayfyMultiple_(arrayOfObject, headers);
    arrayOfObject.forEach(el => {
      el._save = save_.bind(null, this, el);
      el._delete = delete_.bind(null, this, el);
    });
    this.getRange(this.getLastRow() + 1, 1, data.length, data[0].length).setValues(data);
    const res = {
      data: arrayOfObject,
      _save: saveMany_.bind(null, this, arrayOfObject),
      _delete: deleteMany_.bind(null, this, arrayOfObject)
    };
    return res;
  } catch (e) {
    throw new Error(e.stack);
  }
}
