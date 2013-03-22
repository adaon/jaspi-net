var fs = require('fs');

module.exports = {
    'getContent': function (request, callback) {
        if (request.user.isStaff) {
            callback(fs.readFileSync(__dirname + '/templates/ide.html') + '');
        } else {
            callback(false);
        }
    }
};