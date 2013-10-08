youmeb-sequelize
================

## Installaction

    $ npm install youmeb-sequelize

## Config

config/default.json

    {
      ...

      packages: {
        ...

        sequelize: {
          "db": "youmeb",
          "username": "poying",
          "password": "123123".
          "options": {}
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
