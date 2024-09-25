# Orma
Orma is a powerful library designed to streamline data management within Google Apps Script using Google Sheets as a database. It serves as an Object-Relational Mapping (ORM) tool, transforming data into objects for easier manipulation. 

**ORM for Google Apps Script**: Orma simplifies data handling by allowing developers to work with objects instead of multidimensional arrays, leveraging the familiar structure of Google Sheets.

**Simplified Usage**: Orma's intuitive interface and comprehensive documentation make it easy for developers to integrate and utilize its features within their Google Apps Script projects.

Overall, Orma empowers developers to efficiently manage data within Google Sheets, offering a flexible and robust solution for ORM operations within the Google Apps Script environment.









## Table of Contents
- [Before to start](#Before-to-start)
  - [Extended Classes](#Extended-Classes)
  - [Underscore Prefix & Autocomplete](#Underscore-Prefix-&-Autocomplete)
  - [Data Structure](#Data-Structure)
  - [The Database Structure](#The-Database-Structure)
  - [The id Field](#The-id-Field)
  - [The Query Syntax](#The-Query-Syntax)
- [Usage](#sezione-2)
    - [Installation](#Installation)
    - [Open Databases and Tables](#Open-Databases-and-Tables)
    - [Crud Operations](#Crud-Operations)
    - [Data Validation](#Data-Validation)
    - [Other Functions](#Other-functions)
- [Authors](#Authors)
- [License](#License)
- [Feedback](#Feedback)
- [Links](#Links)

## Before to start
[Back to Table of Contents](#Table-of-Contents)

In this paragraph, we will delve into some fundamental aspects of Orma's architecture. 
These aspects will be crucial for mastering the library.
### Extended Classes
[Back to Table of Contents](#Table-of-Contents)

Orma uses the existing [Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet) and [Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet) classes and extends them by adding the necessary methods for the ORM.

So, as in the case below, the variables `db` and `users` are indeed instances of the classes `Spreadsheet` and `Sheet`.

```javascript
const ssId = "your_spreadsheet_id";
const db = ORMA.openDb(ssId);
Logger.log(db); //Spreadsheet

const tables = db._getTables();
const {users} = tables; //users is the name of the sheet we want to open
Logger.log(users); //Sheet
```
### Underscore Prefix & Autocomplete
[Back to Table of Contents](#Table-of-Contents)

please note that the `_getTables` method starts with an underscore. All methods extended in the Google Apps Script classes start with an underscore to avoid conflicts with native methods.

Google Apps Script does not offer autocomplete suggestions for second-level functions in libraries. For this reason, within the `Spreadsheet` and `Sheet` classes in Orma, a property called `_info` is available, which returns a JSON containing the functions available for that instance.

```javascript
const ssId = "your_spreadsheet_id";
const db = ORMA.openDb(ssId);
Logger.log(db._info); 
/*
{
    "_getTables":"a method to get all the tables available in the database"
}
*/

const tables = db._getTables();
const {users} = tables; //users is the name of the sheet we want to open
Logger.log(users._info); 
/*
{
    "_create":"create a new record as an object",
    "_createMany":"create multiple records as array of objects",
    "_find":"find a record by its id value",
    "_firstBy":"get the first record by a specific column from a given value",
    "_firstByQuery":"get the first record by a specific query",
    "_findManyByQuery":"get all the records by a specific query",
    "_findManyBy":"get all the records by a specific column from a given value",
    "_all":"get all the records",
    "_id": "creates an incremental id for the database, or a uuid.",
    "_schema":"the schema of the table"
}
*/

```
### Data Structure
[Back to Table of Contents](#Table-of-Contents)

Once you use the ORM and retrieve data from Google Sheets with functions like `_all`, `_find`, `_firstBy`, etc., the returned object or array of objects will also have the `_save` and `delete` functions available. These functions are necessary, as we will see later, to delete and save any changes made to the objects and propagate them to the database. For this reason, the `_info` property is not available in these objects."

Let's see an example to better understand:
```javascript
const ssId = "your_spreadsheet_id";
const db = ORMA.openDb(ssId);

const tables = db._getTables()
const { users } = tables; //users is the name of the sheet we want to open

const user = users._find("e6021aa4-565-4cad-a395-922c7db47a39_171762521060");
Logger.log(user);
/*
    {
            id:e6021aa4-5685-4cad-a395-922c7db47a39_1717682521060, 
            name:Matteo, 
            _delete:function () { [native code] }, 
            password:5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5, 
            email:matteo@sintropia.io, 
            _save:function () { [native code] }
    }
*/
const allUsers = users._all();
Logger.log(allUsers);
/*
    {
        _save:function () { [native code] },
        _delete:function () { [native code] }, 
        data:[
            {
                _delete:function () { [native code] }, 
                name:Matteo, 
                _save:function () { [native code] }, 
                id:e6021aa4-5685-4cad-a395-922c7db47a39_1717682521060, 
                password:5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5, 
                email:matteo@sintropia.io
            }, 
            {
                id:491e5b8a-3c95-4bee-b704-9d7322db9d26_1717682555762, 
                name:Daniele, 
                _save:function () { [native code] }, 
                email:daniele@sintropia.io, 
                password:a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3, 
                _delete:function () { [native code] }
            }
        ]
    }
*/
```
There are two observations to make about the example above: the first concerns, once again, the use of the underscore as the first character of the function names `_delete` and `_save`. In this case, it is not to avoid conflicts with Google classes but rather to avoid conflicts with the sheet headers. To prevent any type of conflict with the ORMA library, sheet headers should not start with an underscore.

The second observation concerns the difference in the structures of the objects obtained in the example above. When using functions like `_find`, which retrieve a single instance, I will obtain an object containing the properties of the instance retrieved from the database, along with the `_save` and `_delete` functions, necessary as we will see later to modify and delete the instance in the database.

"However, in the case of functions like `_all`, which retrieve an array of objects, the structure of the response will be slightly different: within the object, we find the `_save` and `_delete` functions necessary to save changes or delete all instances obtained from the function. Meanwhile, within the `data` property, individual objects containing the instances obtained from the database will be available. These objects, in turn, contain the properties obtained from the database, along with the `_save` and `_delete` functions necessary to edit and delete the individual instance.

### The Database Structure
To function properly, this library must be used in Sheets with a header in the first row and data present in subsequent rows. Additionally, it is advisable to use snake case for header names without using special characters. In the event of a conflict with these rules, the library will transform the format of the header names without modifying the value in the sheet. So it's possible that within the logs you may find headers written differently than how they are written in the database.

### The id Field
The `_save`, `_delete`, and other methods such as the `_find` method require the presence of the `id` field in the database for it to work properly. Without the `id` field, most of the functionalities will not work, and therefore, the use of this library is not recommended.

### The Query Syntax
In some Orma methods, it's possible to use a query to locate one or more records in the database. The query syntax is straightforward to use because it's nothing more than a boolean expression that accepts every operator available in JavaScript.

The only distinction this syntax has from the traditional JavaScript one lies in the need to refer to an object (the object or objects you want to check if it satisfies the query) using the following notation: {}."

Example:
```JavaScript
const q = `{}.name === "Matteo"`;
//This query verifies that the object's name to be analyzed is 'Matteo'. 
```
# Usage
[Back to Table of Contents](#Table-of-Contents)


## Installation
[Back to Table of Contents](#Table-of-Contents)

To install Orma insert this script id in the library section of your Google Apps Script Project.
```bash
  1CA-kvfiZjY2Ex2C84hL46Vn2F8GijPbfSy9J3vZQUzzbal5ExhQyG0Z7
```


## Open Databases and Tables
[Back to Table of Contents](#Table-of-Contents)

In this section you will learn to open `Databases` (Spreadsheet) and then `Tables` (Sheets). As mentioned above `Databases` are instances of the `Spreadsheet` Class and `Tables` are instances of the `Sheet` Class.
### Open a database

A database in the Orma library is a Spreadsheet instance with embedded more methods, so is important to understand that you can use this entity as a Spreadsheet instance and not only as an Orma Database.

Orma introduces the `openDb` method, which deprecates the `openDbById` method that will still be usable until version 10.

Let's see the powerful of the new `openDb` method.
##### Open Active Spreadsheet as a Database
You can use the active spreadsheet as a database by simply calling the `openDb` method without passing any arguments.
```javascript
const db = ORMA.openDb();
```
##### Open Database By spreadsheet id
Similar to the old `openDbById` method, the `openDb` method also allows you to open a database by passing the spreadsheet id as an argument.
```javascript
const ssId = "your_spreadsheet_id";
const db = ORMA.openDb(ssId);
```
##### Open Database By spreadsheet instance
You can also open the database from the spreadsheet instance of the SpreadsheetApp class.
```javascript
const ssId = "your_spreadsheet_id";
const ss = SpreadsheetApp.openById(ssId);
const db = ORMA.openDb(ss);
```
##### Open Database By File instance
By obtaining a file instance from the DriveApp class of a spreadsheet, you can still use this instance to open your database by passing it as an argument to the `openDb` function.
```javascript
const ssId = "your_spreadsheet_id";
const file = DriveApp.getFileById(ssId);
const db = ORMA.openDb(file);
```

##### Deprecated Methods
The `openDbById` method has been deprecated. It will be usable from version 1 to version 10 of Orma, but it is recommended to start using the `openDb` method.
Let's see how it works.
```javascript
//This method is deprecated, but still available until version 10.
const ssId = "your_spreadsheet_id";
const db = ORMA.openDbById(ssId);
  
  
```

### Open a table 
For example you want to get the "users" sheet to retrieve some data.
You need to call the _getTables function to get all the available tables in the database and then extract the needed one.
Logging the 'tables' variable will give you an object containing the names of all available tables. In the example below, we will retrieve the 'users' table.
```javascript
  const tables = db._getTables();
  const {users} = tables;
```

## Crud Operations
[Back to Table of Contents](#Table-of-Contents)

In this section, you will learn how to handle all the CRUD operations available in the Orma library.

### Get All 
This function will return all the values present in the table.


```javascript
  const allUsers = users._all();
  const data = allUsers.data;
```
[Click here](#Data-Structure) to understand the data structure of the response.


### Get By Id 
This function will return the record corresponding to the indicated id.
```javascript
const userById = users._find(1);
```
[Click here](#Data-Structure) to understand the data structure of the response.

### Get First By
This function will return the first record whose column specified in the function matches the indicated value.
```javascript
const firstUserBy = users._firstBy("name","Matteo")
```
[Click here](#Data-Structure) to understand the data structure of the response.

### Get First By Query
This function will return the first record that exhibits an exact match with the query.
```javascript
const firstUserByQuery = users._firstByQuery(`{}.email !== "matteo@sintropia.io"`)
```
[Click here](#Data-Structure) to understand the data structure of the response.

[Click here](#The-Query-Syntax) to understand the query syntax.
### Find Many By 
This function will return all the records whose column specified in the function matches the indicated value.
```javascript
const manyUsersBy = users._findManyBy("name","Matteo");
const data = manyUsersBy.data;
```
[Click here](#Data-Structure) to understand the data structure of the response.

### Find Many By Query 
This function will return all records whose column specified in the function matches the indicated value.
```javascript
const manyUsersByQuery = users._findManyByQuery(`{}.name === "Matteo"`)
const data = manyUsersByQuery.data;
```
[Click here](#Data-Structure) to understand the data structure of the response.

[Click here](#The-Query-Syntax) to understand the query syntax.

### Create 
This function will create a new instance in the database and return it as an object.
```javascript
const newUser = users._create(
    {
        id: users._id(),
        name: "Matteo",
        email: "matteo@sintropia.io",
        password: ORMA.hash("superPassword1!")
    }
)
```
[Click here](#Data-Structure) to understand the data structure of the response.

### Create Many 
This function will create new instances in the database and return them as an object.
```javascript
const newUsers = users._createMany(
    [
        {
            id: users._id(),
            name: "Matteo",
            email: "matteo@sintropia.io",
            password: ORMA.hash("superPassword1!")
        },
        {
            id: users._id(),
            name: "Daniele",
            email: "daniele@sintropia.io",
            password: ORMA.hash("superPassword1!")
        },
    ]
)
```
[Click here](#Data-Structure) to understand the data structure of the response.

### Edit a single record
To modify an instance, simply modify it after obtaining it and then invoke the `_save` function.
```javascript
const user = users._find(1);
user.name = "Luca";
user._save(); 
```

To modify an instance obtained from an array with other instances, you will first need to access the instance you want to modify and then invoke the `_save` function bounded in the instance object."

```javascript
const manyUsersBy = users._findManyBy("name","Matteo");
const data = manyUsersBy.data;
const firstElement = data[0];
firstElement.name = "Luca";
firstElement._save();
```

### Edit in bulk
To edit all records present in an array of objects in bulk, it will be necessary first to modify them all by iterating through the data property, and then invoke the _save function present in the main object.

```javascript
const manyUsers = users._findManyBy("name","Matteo");
for(let el of manyUsers.data){
    el.name = "Massimo"
}
allUsers._save();
```

### Delete a single record
To delete a single record, simply invoke the `_delete` function available in the object of the instance to be deleted.

```javascript
const user = users._find(1);
user._delete(); 
```

### Delete in bulk
To delete multiple elements simultaneously after obtaining them, simply invoke the `_delete` function present in the main object."
```javascript
const manyUsers = users._findManyBy("name","Matteo");
manyUsers._delete();
```

## Data Validation
[Back to Table of Contents](#Table-of-Contents)

Starting from version 8 of Orma, it will be possible to assign a schema to tables, enabling data validation during CRUD operations.

### Install Orma Valid
Before you start creating table schemas, you will need to install the latest version of the `Orma Valid` library, which provides predefined methods for performing the necessary validations.

```bash
  1vWTKm6a_C_gTomlFnbREJ5ResvmJlgneFsHDgPv5mt0BvozXHeIaadtD
```

### Create a schema
The `_schema` property is an Orma attribute of the `Table` entity. Once you obtain a table, you can define a schema for it if needed.

The schema is an object where the keys are the table columns (the headers in Google Sheet) and the values are arrays of objects, each specifying the required validation.

Each object must include the `valid` property, which contains a function from the `ORMA_VALID` library (be careful not to call the function directly within the object). Some methods from `ORMA_VALID` require arguments to work correctly. In such cases, in addition to the valid property, you will also need to provide the `args` property, which should be an array of values.

Let's see an example:

```javascript
//Define db
const db = ORMA.openDb();

//Get Tables from db
const tables = db._getTables();
const { authors, books } = tables

//Defining Schema
books._schema = {
  id: [
    { valid: ORMA_VALID.isNumber },
    { valid: ORMA_VALID.isNotNull },
  ],
  name: [
    { valid: ORMA_VALID.isString },
    { valid: ORMA_VALID.isTrimmed },
    { valid: ORMA_VALID.hasMinLength, args: [2] },
    { valid: ORMA_VALID.hasMaxLength, args: [256] },
  ],
  author_id: [
    { valid: ORMA_VALID.isNumber },
    { valid: ORMA_VALID.isNotNull },
  ],
  pages: [
    { valid: ORMA_VALID.isNumber },
    { valid: ORMA_VALID.isBetween, args: [1, 5000] },
  ],
  type: [
    { valid: ORMA_VALID.isString },
    { valid: ORMA_VALID.isTrimmed },
    { valid: ORMA_VALID.isEnum, args: ["Novels", "Essays", "Comics"] },

  ]
}
```

In this way, `Orma` will validate your requests before executing CRUD functions and will return errors if the validation fails.

### Best Practice
As mentioned earlier, validation must be added to the `_schema` property of the table entity, so it should be declared before performing CRUD operations. For clarity and to maintain scalable code, we recommend isolating table declarations and _schema building in a separate function, as shown below:

```javascript
function allTables() {
  //Define db
  const db = ORMA.openDb();

  //Get Tables from db
  const tables = db._getTables();
  const { authors, books } = tables

  //Defining Book Schema
  books._schema = {
    id: [
      { valid: ORMA_VALID.isNumber },
      { valid: ORMA_VALID.isNotNull },
    ],
    name: [
      { valid: ORMA_VALID.isString },
      { valid: ORMA_VALID.isTrimmed },
      { valid: ORMA_VALID.hasMinLength, args: [2] },
      { valid: ORMA_VALID.hasMaxLength, args: [256] },
    ],
    author_id: [
      { valid: ORMA_VALID.isNumber },
      { valid: ORMA_VALID.isNotNull },
    ],
    pages: [
      { valid: ORMA_VALID.isNumber },
      { valid: ORMA_VALID.isBetween, args: [1, 5000] },
    ],
    type: [
      { valid: ORMA_VALID.isString },
      { valid: ORMA_VALID.isTrimmed },
      { valid: ORMA_VALID.isEnum, args: ["Novels", "Essays", "Comics"] },

    ]
  }

  //Defining Authors Schema
  authors._schema = {
    id: [
      { valid: ORMA_VALID.isNumber },
      { valid: ORMA_VALID.isNotNull },
    ],
    first_name: [
      { valid: ORMA_VALID.isString },
      { valid: ORMA_VALID.isTrimmed },
      { valid: ORMA_VALID.hasMinLength, args: [2] },
      { valid: ORMA_VALID.hasMaxLength, args: [256] },
    ],
    last_name: [
      { valid: ORMA_VALID.isString },
      { valid: ORMA_VALID.isTrimmed },
      { valid: ORMA_VALID.hasMinLength, args: [2] },
      { valid: ORMA_VALID.hasMaxLength, args: [256] },
    ],
  }

  return {
    authors,
    books
  }

}
```

In this way, you can call the `allTables` function from anywhere in your code and retrieve the tables with the correct schema.

### Available validations
#### Type Validation
Type validation ensures that a value conforms to the expected data type
| Valid | Args| Details|
|------------|----------|----------|
|`isBoolean` |  undefined  | Checks if a value is boolean  |
| `inNumber` |  undefined | Checks if a value is number  |
| `isString` |  undefined | Checks if a value is string   |
| `isNotNull`|  undefined | DChecks if a value is not null   |

#### Number Validations
Number validation ensures that a value meets specified criteria for numeric data

| Valid | Args| Details|
|------------|----------|----------|
| `isGreaterThen`|[`number`] |Checks if a number is greater then the first argument|
|`isLessThen`|[`number`] |Checks if a number is smaller then the first argument|
|`isGreaterOrEqualto`|[`number`] |Checks if a number is greater or equal to the first argument|
|`isLessOrEqualto`|[`number`] |Checks if a number is smaller or equal to the first argument|
|`isEqualTo`|[`number`] |Checks if a number is equal to the first argument|
|`isBetween`|[`number`,`number`] |Checks if a number is inside the range defined by the first and second arguments, inclusive|
|`isNotBetween`|[`number`,`number`] |Checks if a number is outside the range defined by the first and second arguments, inclusive|
|`isInteger`|undefined |Checks if a number is an integer number|
|`isDecimal`|undefined |Checks if a number is a decimal number|

#### String Validations
String validation ensures that a value meets specific criteria for text data
| Valid | Args| Details|
|------------|----------|----------|
|`hasMaxLength`|[`number`]|Checks if a string has no more than the number of characters specified by the first argument|
|`hasMinLength`|[`number`]|Checks if a string has more than the number of characters specified by the first argument|
|`isURL`|undefined|Checks if a string is a URL|
|`isEmail`|undefined|Checks if a string is an email|
|`isPassword`|undefined|Checks if a string is at least 10 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character|
|`isTrimmed`|undefined|Checks if a string is trimmed|
|`isUpperCase`|undefined|Checks if a string is uppercase|
|`isLowerCase`|undefined|Checks if a string is lowercase|
|`isJSON`|undefined|Checks if a string is a valid JSON|

#### Other Validations
| Valid | Args| Details|
|------------|----------|----------|
|`isUnique` | undefined|Ensures that a value must be unique|
|`isNotMutable` | undefined|Ensures that a value is not editable |
|`isEnum` | [...`any`]|Ensures that a value is one of the values specified in the arguments |

#### Custom Validations Functions
In `Orma`, you can create custom validation functions and use them just like the functions provided in the ORMA_VALID library.

Here is an example of how to construct a custom validation function:

```javascript
function customValidation() {
  //This function returns the data you need to make your custom validation
  const data = ORMA_VALID.getArguments(arguments);
  const { table, id, key, value, args} = data;
 
  //Build your own validation
  if (value) {
    return true
  } else {
    throw new Error("not valid")
  }
}
```

Let’s take a closer look at the function above: declaring the variable data you will call a function from the ORMA_VALID library that returns an object containing the arguments needed to create a custom validation function:

* `table`: the table to which the value to validate belongs
* `id`:  the id of the element to wich the value to validate belongs
* `key`: the key of the value (column name)
* `value`: the value you want to validate
* `args`: the array you optionally pass to the `args` property within the table's `_schema` property.



## Other Functions
[Back to Table of Contents](#Table-of-Contents)

This section provides various functions designed to facilitate the use of the Orma library, making the user's work simpler and more efficient.

### ID Generator
Orma allows generating unique identifiers for each table. It supports two modes for generating identifiers: using incremental numeric IDs or unique UUIDs (Universal Unique Identifiers). The UUID format used is a modified version created by Orma to further minimize the possibility of creating duplicate values.

```javascript
const id = users._id(true) // UUID version
const incremental = users._id() // Incremental Version
```
By using incremental IDs, Orma will leverage the PropertiesService in Apps Script to store these IDs. You can access and delete the saved properties using the following methods:

#### Getting all the properties
```javascript
const properties = ORMA.getProperties(); //it will shows all the keys
```

#### Deleting a property
```javascript
ORMA.deleteProperty("propertyName); //it will delete the property
```


### Hashing
This function allows you to hash values as passwords.
```javascript
const password = "123456";
const hashedPassword = ORMA.hash(password);
```
You can also use a salt value to hash values and maximise the security.
```javascript
const password = "123456";
const email = "matteo@sintropia.io"
const hashedPassword = ORMA.hash(password, email);
```

## Authors
[Back to Table of Contents](#Table-of-Contents)

- [@sintropia](https://www.github.com/sintropia)


## License
[Back to Table of Contents](#Table-of-Contents)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)



## Feedback
[Back to Table of Contents](#Table-of-Contents)

If you have any feedback, please reach out to us at matteo@sintropia.io


## 🔗 Links
[Back to Table of Contents](#Table-of-Contents)

[![sintropia](https://img.shields.io/badge/sintropia.io-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://sintropia.io/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/matteoimperiale)
