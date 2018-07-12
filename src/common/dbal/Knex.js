/**
 * Bookshelf Database Abstraction Layer (DBAL) pattern
 * @author Helio Nogueira <helio.nogueir@gmail.com>
 */
module.exports = class Knex {

    /**
     * Construct Object
     * @param Object database
     * @returns null
     */
    constructor(database) {
        try {
            this.dbal = null;
            this.driver = database.driver;
            this.host = database.host;
            this.username = database.username;
            this.password = database.password;
            this.dbname = database.dbname;
            this.port = database.port;
            this.charset = database.charset;
        } catch (err) {
            throw err;
        }
        return null;
    }

    /**
     * Connect in database
     * @returns Object
     */
    connect() {
        try {
            if (!(this.dbal instanceof Object)) {
                var knex = require("knex");
                this.dbal = new knex({
                    client: this.driver,
                    connection: {
                        host: this.host,
                        user: this.username,
                        password: this.password,
                        database: this.dbname,
                        charset: this.charset,
                        port: this.port
                    }
                });
            }
        } catch (err) {
            throw err;
        }
        return this.dbal;
    }

    /**
     * Close connect database
     * @returns null        
     */
    close() {
        try {
            if (this.dbal instanceof Object) {
                this.dbal.destroy();
                this.dbal = null;
            }
        } catch (err) {
            throw err;
        }
        return null;
    }

}