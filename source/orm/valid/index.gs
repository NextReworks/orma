function valid_(table, toValid) {
  const schema = table._schema;
  const id = toValid.id;
  for (key in schema) {
    const value = toValid[key];
    const validations = schema[key];
    for (validation of validations) {
      const func = validation.valid;
      const args = validation.args;
      if (args) {
        func(...args, value, key, id, table);
      } else {
        func(value, key, id, table);
      }
    }
  }
  return toValid
};

function validMultiple_(table, toValid) {
  const schema = table._schema;
  for (el of toValid) {
    const id = el.id;
    for (key in schema) {
      const value = el[key];
      const validations = schema[key];
      for (validation of validations) {
        const func = validation.valid;
        const args = validation.args;
        if (args) {
          func(...args, value, key, id, table);
        } else {
          func(value, key, id, table);
        }
      }
    }
  }
  return toValid
};

