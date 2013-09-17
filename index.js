'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var moment = require('moment');
var Sequelize = require('sequelize');

// 設定:
//   
//   db            db 名稱
//   username      user 名稱
//   passsword     user 密碼
//   options       其他選項, 請參考 http://sequelizejs.com/documentation
//
// 愈設會把 this 註冊成 sequelize
module.exports = function ($youmeb, $injector, $config, $generator, $prompt) {

  $youmeb.on('help', function (command, data, done) {
    data.commands.push(['sequelize:generate:model', '', 'Generates a sequelize model']);
    data.commands.push(['sequelize:generate:migration', '', 'Generates a sequelize migration']);
    data.commands.push(['sequelize:migrate', '', '']);
    data.commands.push(['sequelize:migrate-undo', '', '']);
    done();
  });

  var getSequelize = function (config) {
    return new Sequelize(config.get('db') || 'youmeb-app', config.get('username') || 'root', config.get('password') || '123', config.get('options') || {});
  };

  this.on('init', function (config, done) {
    if ($youmeb.isCli) {
      $injector.register('sequelize', {
        model: function () {} // 變免執行 youmeb routes 的時候出錯
      });
      return done();
    }

    var sequelize = getSequelize(config);
    
    sequelize.Sequelize = Sequelize;

    // 重新註冊 sequelize
    $injector.register('sequelize', sequelize);

    // init
    var importDir = function (dir, importDone) {
      fs.readdir(dir, function (err, files) {
        if (err) {
          return importDone(err);
        }
        var i = 0;
        var isJs = /\.js$/i;
        (function next() {
          var file = files[i++];
          if (!file) {
            return importDone(null);
          }
          if (file === 'index.js' || !isJs.test(file)) {
            return next();
          }
          file = path.join(dir, file);
          fs.stat(file, function (err, stats) {
            if (err) {
              return importDone(err);
            }
            if (stats.isFile()) {
              sequelize.import(file);
              next();
            } else {
              importDir(file, function (err) {
                if (err) {
                  return importDone(err);
                }
                next();
              });
            }
          });
        })();
      });
    };

    // sequelize.import 目錄下所有檔案
    // 最後執行 index.js，讓使用者設定關聯
    var dir = path.join($youmeb.root, config.get('modelsDir') || 'models');
    importDir(dir, function (err) {
      if (err) {
        return done(err);
      }
      var index;

      try {
        index = require(dir);
      } catch (e) {
        return done(null);
      }

      if (typeof index === 'function') {
        index(sequelize);
      }

      done(null);
    });
  });

  // generator
  $youmeb.on('cli-sequelize:generate:model', function (parser, args, done) {
    $prompt.get([
      {
        name: 'name',
        type: 'string',
        required: true
      }
    ], function (err, result) {
      if (err) {
        return done(err);
      }

      var generator = $generator.create(path.join(__dirname, 'templates'), path.join($youmeb.root, $config.get('sequelize.modelsDir') || 'models'));

      generator.on('create', function (file) {
        console.log();
        console.log('  create '.yellow + file);
        console.log();
      });

      generator.createFile('./model.js', './' + result.name + '.js', {
        name: result.name[0].toUpperCase() + result.name.substr(1)
      }, done);
    });
  });

  $youmeb.on('cli-sequelize:generate:migration', function (parser, args, done) {
    $prompt.get([
      {
        name: 'name',
        type: 'string',
        default: 'unnamed-migration',
        required: false
      }
    ], function (err, result) {
      if (err) {
        return done(err);
      }

      var migrationName = [
        moment().format('YYYYMMDDHHmmss'),
        result.name
      ].join('-');

      var generator = $generator.create(path.join(__dirname, 'templates'), path.join($youmeb.root, $config.get('sequelize.migrationsDir') || 'migrations'));

      generator.on('create', function (file) {
        console.log();
        console.log('  create '.yellow + file);
        console.log();
      });

      generator.createFile('./migration.js', './' + migrationName + '.js', {}, done);
    });
  });

  // migrator
  $youmeb.on('cli-sequelize:migrate', function (parser, args, done) {
    var config = $config.namespace('sequelize');
    var sequelize = getSequelize(config);
    var migratorOptions = {
      path: path.join($youmeb.root, config.get('migrationsDir') || 'migrations')
    };
    var migrator = sequelize.getMigrator(migratorOptions);

    fs.exists(migratorOptions.path, function (exists) {
      (exists ? function (migrate) {
        migrate();
      } : function (migrate) {
        mkdirp(migratorOptions.path, function (err) {
          if (err) {
            return done(err);
          }
          migrate();
        });
      })(function () {
        sequelize.migrate().success(function() {
          done();
        });
      });
    });
  });

  $youmeb.on('cli-sequelize:migrate-undo', function (parser, args, done) {
    var config = $config.namespace('sequelize');
    var sequelize = getSequelize(config);
    var migratorOptions = {
      path: path.join($youmeb.root, config.get('migrationsDir') || 'migrations')
    };
    var migrator = sequelize.getMigrator(migratorOptions);

    fs.exists(migratorOptions.path, function (exists) {
      (exists ? function (migrate) {
        migrate();
      } : function (migrate) {
        mkdirp(migratorOptions.path, function (err) {
          if (err) {
            return done(err);
          }
          migrate();
        });
      })(function () {
        sequelize.migrator.findOrCreateSequelizeMetaDAO().success(function(Meta) {
          Meta.find({ order: 'id DESC' }).success(function(meta) {
            if (meta) {
              meta.path = migratorOptions.path;
              migrator = sequelize.getMigrator(meta, true);
            }
            migrator.migrate({ method: 'down' }).success(function() {
              done();
            });
          });
        });
      });
    });
  });
};
