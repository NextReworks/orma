const ENV = {
  ORMA: {
    DOCU: {
      URL: "https://github.com/Sintropiadotio/orma"
    },
    COUNTER:{
      PROPERTY:{
        NAME: "count"
      }
    }
  },
  DRIVEAPP: {
    METHODS: {
      GET_MIME_TYPE: "getMimeType",
    },
    MIME_TYPES: {
      SHEET: "application/vnd.google-apps.spreadsheet"
    }
  },
  SPREADSHEETAPP: {
    METHODS: {
      GET_SHEET_BY_NAME: "getSheetByName"
    }
  },
  VALUE_TYPES: {
    OBJECT: "object",
    STRING: "string"
  },
  CUSTOM: {
    HPPT_STRING: "https://",
    INCREMENTAL_ID: "_incremental_id"
  },
  MESSAGES: {
    NOT_A_SPREADSHEET: "The File is not a Spreadsheet",
    NOT_VALID_ARGUMENT: "This is not a valid argument",
    DELETED: "deleted",
    NO_INSTANCE_TO_CREATE: "No elements to create",
    GET_TABLES: "get all the tables available in the database",
    CREATE: "create a new record as an object",
    CREATE_MANY: "create multiple records as array of objects",
    FIND: "find a record by its id value",
    FIRST_BY: "get the first record by a specific column from a given value",
    FIRST_BY_QUERY: "get the first record by a specific query",
    FIND_MANY_BY_QUERY: "get all the records by a specific query",
    FIND_MANY_BY: "get all the records by a specific column from a given value",
    ALL: "get all the records",
    ID: "creates an incremental id for the database, or a uuid.(pass true for a uuid)",
    MUST_BE_MULTIDIMENSIONAL_ARRAY: 'The array must be multidimensional',
    MUST_BE_STRING: `The value %%1%% must be a string`,
    UUID_MUST_BE_BOOL: "the uuid value %%1%% must be boolean",
    SALT_MUST_BE_STRING: `The salt value %%1%% must be a string`,
    HASH_MUST_BE_STRING: `The value to hash %%1%% must be a string`,
    NO_INSTANCE_GIVEN_COLUMN: "no instance found with the value %%1%% for the column %%2%%",
    NO_INSTANCE_GIVEN_ID: "no instance found with the id %%1%%",
    NO_INSTANCE_GIVEN_QUERY: "no instance found with the query %%1%%",
    SCHEMA: "the schema of the table",
    NO_ARRAY: "You must pass an array as argument in the _createMany function",
    NO_OBJECT: "You must pass an object as argument in the _create function",
    NO_KEY: "The _firstBy function needs a key and a value as parameters",
    NO_KEY_MANY: "The _findManyBy function needs a key and a value as parameters",
    NO_ID: "The _find function needs an id as parameter",
    NO_QUERY: "The _firstByQuery function needs a query as parameter",
    NO_QUERY: "The _findManyByQuery function needs a query as parameter"
  },
  PLACEHOLDERS:{
    ONE: "%%1%%",
    TWO: "%%2%%",
    THREE: "%%3%%",
  }
}
