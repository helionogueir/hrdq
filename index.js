/**
 * Start Application
 * @author Helio Nogueira <helio.nogueir@gmail.com>
 */
module.exports = function () {
    try {
        var path = require('path');
        var module = {
            file: {
                KillProcess: require(path.resolve("./src/module/file/KillProcess"))
            }
        };
        (new module.file.KillProcess()).start();
    } catch (err) {
        console.log(err);
    }
}();