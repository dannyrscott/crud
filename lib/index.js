'use strict';

const config = require('./config');
const Glue = require('glue');
const options = {
    relativeTo: __dirname
};


/**
 * Application Bootstrap
 */
module.exports.getServer = (cb) => {
    let manifest = {
        connections: [
            config.server
        ],
        registrations: [{
            plugin: {
                register: './db',
                options: config
            }
        }]
    };

    Glue.compose(manifest, options, (err, server) => {
        if (err) {
            return cb(err);
        }
        cb(null, server);
    });
};
