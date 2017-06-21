'use strict';

const config = require('./config');
const Glue = require('glue');
const options = {
    relativeTo: __dirname
};

module.exports = () => {
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
            throw err;
        }

        server.start(() => {
            console.log(`Server listning: ${server.info.uri}`);
        });
    });
};
