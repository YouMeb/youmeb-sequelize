Youmeb-sequelize
================
Youmeb-sequelize is a communicated 



Before you install this package, you must install :

* mysql :
* npm mysql : `$ npm install mysql`


## Installaction

    $ npm install youmeb-sequelize

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

* `$ sequelize:generate:migration`
* `$ sequelize:generate:model`
* `$ sequelize:migrate`
* `$ sequelize:migrate-undo`

## License

(The MIT License)

Copyright (c) 2013 YouMeb and contributors.
