module.exports = {
    dbURL: 'mongodb://localhost/net',
    staticDir: __dirname + '/static',
    apps: {
        '/ide/': require('./ide'),
    }
};