Youmeb-sequelize
================
Youmeb-sequelize is a YouMebJS package which will help you communicate with your MySQL DB by sequelize ORM .If you want to use sequelize, you only use `$sequlize`. It will inject `sequelize` function to your applications.You `DON'T NEED TO WRITE` require sequelize in every YouMeb Packages or your applications.



Before you install this package, you must install :

* mysql 
* npm mysql : `$ npm install mysql`

## Installaction

```bash
    $ npm install youmeb-sequelize
```

## Setting Config

Edit `/config/default.json` file:

    {
      ...

      packages: {
        ...

        sequelize: {
          "db": "youmeb",
          "username": "poying",
          "password": "123123",
          "options": {
                "host": "yourDBhostUrl"
          }
        }
      }
    }

## Usage

You can type `youmeb --help` in your cli , and see more description:

* `$ sequelize:generate:migration`:

    Generate a new migration and name it, you will see a new migration file(xxxxxx-dbname.js) at `/migration/`. 

* `$ sequelize:generate:model`:

    Generate a new model schema and name it, you will see a new model schema file(dbname.js) at `/models/`.

* `$ sequelize:migrate`:

    Execute migration.

* `$ sequelize:migrate-undo`

    Undo migration.



## License

(The MIT License)

Copyright (c) 2013 YouMeb and contributors.
