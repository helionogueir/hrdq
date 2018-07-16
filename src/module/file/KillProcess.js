/**
 * Kill Process by File
 * @author Helio Nogueira <helio.nogueir@gmail.com>
 */
module.exports = class KillProcess {

    /**
     * Execute kill process by file
     * @returns null
     */
    start() {
        try {
            var selfObject = this;
            var fs = require('fs');
            var path = require('path');
            var pattern = new RegExp(/^(.*)\.(json)$/);
            var directory = path.resolve('./data/module/file/kill');
            fs.readdir(directory, function (err, files) {
                if (err) {
                    throw new Error(err);
                }
                files.forEach(function (file) {
                    try {
                        if (pattern.test(file)) {
                            var data = require(path.resolve(directory + '/' + file));
                            var dbal = selfObject.prepareDbal(data);
                            selfObject.seekOnes(dbal, data);
                        }
                    } catch (ex) {
                        dbal.close();
                        throw ex;
                    }
                });
            });
        } catch (ex) {
            throw ex;
        }
        return null;
    }

    /**
     * Prepare DBAL (Database Abstraction Layer)
     * @param Object data
     * @returns null
     */
    prepareDbal(data) {
        try {
            var path = require('path');
            var common = {
                dbal: {
                    Knex: require(path.resolve("./src/common/dbal/Knex"))
                }
            };
            var dbal = new common.dbal.Knex(data.database);
            return dbal;
        } catch (ex) {
            if (null != dbal) {
                dbal.close();
            }
            return null;
            throw ex;
        }
    }

    /**
     * Find IDs to kill
     * @param Knex dbal
     * @param Object data
     * @returns null
     */
    seekOnes(dbal, data) {
        try {
            var selfObject = this;
            var stmt = dbal.connect();
            stmt.raw(data.query.sql.seek, data.query.params)
                .timeout(data.query.timeout, { cancel: true })
                .then(function (response) {
                    try {
                        if ((undefined != response[0]) && (response[0] instanceof Array)) {
                            response[0].forEach(function (row) {
                                var timeout = null;
                                clearTimeout(timeout);
                                timeout = setTimeout(function () {
                                    dbal.close();
                                }, (data.query.timeout / 4));
                                selfObject.killById(dbal, data, row.id);
                            });
                        }
                    } catch (ex) {
                        dbal.close();
                        console.log(ex);
                    }
                })
                .catch(function (err) {
                    dbal.close();
                    throw new Error(err);
                });
        } catch (ex) {
            throw ex;
        }
        return null;
    }

    /**
     * Kill by ID to kill
     * @param Knex dbal
     * @param Object data
     * @param int id
     * @returns null
     */
    killById(dbal, data, id) {
        try {
            var stmt = dbal.connect();
            stmt.raw(data.query.sql.kill, { "id": id })
                .timeout(data.query.timeout, { cancel: true })
                .then(function (response) {
                    console.log('driver: %s | host: %s | dbname: %s | username: %s | kill: %d'
                        , data.database.driver
                        , data.database.host + ':' + data.database.port
                        , data.database.dbname
                        , data.database.username
                        , id);
                })
                .catch(function (err) {
                    dbal.close();
                    console.log(err);
                });
        } catch (ex) {
            throw ex;
        }
        return null;
    }

}