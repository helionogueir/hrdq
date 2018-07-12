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
            this.prepareFiles(this.execute);
        } catch (ex) {
            throw ex;
        }
        return null;
    }

    /**
     * Prepare files
     * @param function next
     * @returns null
     */
    prepareFiles(next) {
        var path = require('path');
        var fs = require('fs');
        var pattern = new RegExp(/^(.*)\.(json)$/);
        var directory = path.resolve('./data/module/file/kill');
        fs.readdir(directory, function (err, files) {
            if (err) {
                throw new Error(err);
            }
            files.forEach(function (file) {
                try {
                    if (pattern.test(file)) {
                        var content = require(path.resolve(directory + '/' + file));
                        next(content);
                    }
                } catch (ex) {
                    throw ex;
                }
            });
        });
        return null;
    }

    /**
     * Execute database process
     * @param Object data
     * @returns null
     */
    execute(data) {
        try {
            var path = require('path');
            var common = {
                dbal: {
                    Knex: require(path.resolve("./src/common/dbal/Knex"))
                }
            };
            var dbal = new common.dbal.Knex(data.database);
            var stmt = dbal.connect();
            stmt.raw('SELECT id, username FROM mdl_user WHERE id in (1, 2)', data.query.params)
                .timeout(data.query, { cancel: true })
                .then(function (response) {
                    dbal.close();
                    if ((undefined != response[0]) && (response[0] instanceof Array)) {
                        response[0].forEach(function (row) {
                            console.log(row);
                        });
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

}